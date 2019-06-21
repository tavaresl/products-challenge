import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { User } from '../user/user.entity';

describe('ProductService', () => {
  let repository: Repository<Product>;
  let service: ProductService;

  beforeEach(async () => {
    repository = new Repository<Product>();
    service = new ProductService(repository);
  });

  it('should create a new product', async () => {
    const expectedProduct = new Product('Shampoo', 'Para cabelos', 'Cosméticos');

    expectedProduct.id = 1;
    expectedProduct.useMode = null;
    expectedProduct.legalInformation = null;
    expectedProduct.owner = new User('John', 'Wick', 'john@mail.com', 'password');

    jest.spyOn(repository, 'save').mockImplementation(async () => expectedProduct);

    const product = new Product('Shampoo', 'Para cabelos', 'Cosméticos');
    expect(await service.save(product)).toEqual(expectedProduct);
  });

  it('should resolve a product by id', async () => {
    const expectedProduct = new Product('Shampoo', 'Para cabelos', 'Cosméticos');

    expectedProduct.id = 1;
    expectedProduct.useMode = null;
    expectedProduct.legalInformation = null;
    expectedProduct.owner = new User('John', 'Wick', 'john@mail.com', 'password');

    jest.spyOn(repository, 'findOne').mockImplementation(async () => expectedProduct);

    expect(await service.getById(1)).toEqual(expectedProduct);
  });

  it('should resolve a list of products by owner', async () => {
    const queryBuilderMock = {
      select: () => queryBuilderMock,
      leftJoin: () => queryBuilderMock,
      where: () => queryBuilderMock,
      getMany: jest.fn(),
    };
    const expectedProduct = new Product('Shampoo', 'Para cabelos', 'Cosméticos');

    expectedProduct.id = 1;
    expectedProduct.useMode = null;
    expectedProduct.legalInformation = null;

    jest.spyOn(repository, 'createQueryBuilder').mockImplementation(() => queryBuilderMock as any);
    queryBuilderMock.getMany.mockImplementation(async () => [expectedProduct]);

    const owner = new User('John', 'Wick', 'john@mail.com', 'password');
    owner.id = 1;

    expect(await service.getByUser(owner)).toEqual([expectedProduct]);
  });

  it('should delete a product', async () => {
    const product = new Product('Shampoo', 'Para cabelos', 'Cosméticos');

    jest.spyOn(repository, 'delete').mockImplementation(async () => null);

    expect(await service.delete(product)).toBeUndefined();
  });
});
