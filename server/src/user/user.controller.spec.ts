import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';

jest.mock('bcrypt');

import * as bcrypt from 'bcrypt';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserDTO } from './dto/user.dto';
import { CredentialDTO } from './dto/credential.dto';

describe('User Controller', () => {
  let controller: UserController;
  let jwtService: JwtService;
  let userService: UserService;

  beforeEach(async () => {
    jwtService = new JwtService({ secret: '' });
    userService = new UserService(new Repository<User>());
    controller = new UserController(userService, jwtService);
  });

  it('should create a new user', async () => {
    const userDTO = new UserDTO();

    userDTO.firstName = 'John';
    userDTO.lastName = 'Wick';
    userDTO.email = 'john@mail.com';
    userDTO.password = 'password';

    const user = new User('John', 'Wick', 'john@mail.com', 'password');
    user.id = 1;

    jest.spyOn(userService, 'save').mockImplementation(async () => user);

    expect(await controller.createaNew(userDTO)).toEqual(user);
  });

  it('should authenticate an user', async () => {
    const credential = new CredentialDTO();
    credential.email = 'john@mail.com';
    credential.password = 'password';

    const user = new User('John', 'Wick', 'john@mail.com', 'password');

    jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);
    jest.spyOn(userService, 'getByEmail').mockImplementation(async () => user);
    jest.spyOn(jwtService, 'sign').mockImplementation(() => 'TOKEN_EXAMPLE_VALUE');

    expect(await controller.authenticate(credential)).toEqual({ token: 'TOKEN_EXAMPLE_VALUE' });
  });

  it('should return info about the authenticated user', async () => {
    const user = new User('John', 'Wick', 'john@mail.com', 'password');
    const request = { user };

    expect(await controller.getAuthenticatedUserInfo(request as any)).toEqual(user);
  });
});
