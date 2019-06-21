import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async save(user: User): Promise<User> {
    const saved = await this.userRepository.save(user, { reload: true });
    return saved;
  }

  async getByEmail(email: string): Promise<User> {
    const foundUsers = await this.userRepository.find({ where: { email }});

    if (!foundUsers || !foundUsers.length) {
      throw new Error('cannot find any user with giver email.');
    }

    return foundUsers.shift();
  }

  async getById(id: number): Promise<User> {
    const user = await this.userRepository.findOne(id);

    return user;
  }
}
