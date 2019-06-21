import {
  Controller,
  Body,
  BadRequestException,
  Post, UseInterceptors,
  ClassSerializerInterceptor,
  UnauthorizedException,
  HttpCode,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { compare } from 'bcrypt';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserDTO } from './dto/user.dto';
import { CredentialDTO } from './dto/credential.dto';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) { }

  @Post()
  public async createaNew(@Body() newUserInfo: UserDTO) {
    try {
      const user = new User(
        newUserInfo.firstName,
        newUserInfo.lastName,
        newUserInfo.email,
        newUserInfo.password,
      );

      const newUser = await this.userService.save(user);

      return newUser;
    } catch (err) {
      throw new BadRequestException();
    }
  }

  @Post('auth')
  @HttpCode(200)
  public async authenticate(@Body() credential: CredentialDTO) {
    try {
      const user = await this.userService.getByEmail(credential.email);
      const passwordsAreEqual = await compare(credential.password, user.password);

      if (!passwordsAreEqual) {
        throw new Error('invalid credentials.');
      }

      return { token: this.jwtService.sign({ id: user.id }) };
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }

  @Get('me')
  @UseGuards(AuthGuard())
  public async getAuthenticatedUserInfo(@Req() request: Request) {
    try {
      const user = request.user;

      return user;
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }
}
