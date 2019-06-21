import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './user.entity';

describe('UserService', () => {
  const repositoryMock = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  };
  let service: UserService;

  beforeEach(async () => {
    service = new UserService(repositoryMock as any);
  });

  it('should create a new user', async () => {
    const user = new User('John', 'Wick', 'john@mail.com', 'password');
    const created = {
      id: 1,
      firstName: 'John',
      lastName: 'Wick',
      email: 'john@mail.com',
      password: 'password',
    };

    repositoryMock.save.mockResolvedValue(created);

    expect(await service.save(user)).toEqual(created);
  });

  it('should return an user by email', async () => {
    const user = {
      id: 1,
      firstName: 'John',
      lastName: 'Wick',
      email: 'john@mail.com',
      password: 'password',
    };

    repositoryMock.find.mockResolvedValue([user]);

    expect(await service.getByEmail('john@mail.com')).toEqual(user);
  });

  it('should return an user by id', async () => {
    const user = {
      id: 1,
      firstName: 'John',
      lastName: 'Wick',
      email: 'john@mail.com',
      password: 'password',
    };

    repositoryMock.findOne.mockResolvedValue(user);

    expect(await service.getById(1)).toEqual(user);
  });
});
