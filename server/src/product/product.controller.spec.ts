import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { ProductDTO } from './dto/product.dto';
import { User } from '../user/user.entity';

describe('Product Controller', () => {
  let service: ProductService;
  let controller: ProductController;

  beforeEach(async () => {
    service = new ProductService(new Repository<Product>());
    controller = new ProductController(service);
  });

  it('should create a new product', async () => {
    const productInfo = new ProductDTO();

    productInfo.name = 'Shampoo';
    productInfo.description = 'Para cabelos cacheados';
    productInfo.category = 'Cosméticos';

    const product = new Product('Shampoo', 'Para cabelos cacheados', 'Cosméticos');
    const user = new User('John', 'Wick', 'john@mail.com', 'password');

    jest.spyOn(service, 'save').mockImplementation(async () => product);

    expect(await controller.create(productInfo, { user } as any)).toEqual(product);
  });

  it('should return products by authenticated user', async () => {
    const product = new Product('Shampoo', 'Para cabelos cacheados', 'Cosméticos');
    const user = new User('John', 'Wick', 'john@mail.com', 'password');

    jest.spyOn(service, 'getByUser').mockImplementation(async () => [product]);

    expect(await controller.getAllByUser({ user } as any)).toEqual([product]);
  });

  it('should delete a product by its id', async () => {
    const product = new Product('Shampoo', 'Para cabelos cacheados', 'Cosméticos');
    const user = new User('John', 'Wick', 'john@mail.com', 'password');

    user.id = 1;
    product.owner = user;

    jest.spyOn(service, 'getById').mockImplementation(async () => product);
    jest.spyOn(service, 'delete').mockImplementation(async () => undefined);

    expect(await controller.deleteProduct('1', { user } as any)).toBeUndefined();
  });

  it('should update a product', async () => {
    const user = new User('John', 'Wick', 'john@mail.com', 'password');
    const product = new Product('Shampoo', 'Para cabelos cacheados', 'Cosméticos');

    user.id = 1;
    product.owner = user;

    const newInfo: Partial<Product> = { useMode: 'Aplique no cabelo.' };
    const expectedProduct = new Product('Shampoo', 'Para cabelos cacheados', 'Cosméticos', 'Aplique no cabelo.');

    expectedProduct.id = 1;
    expectedProduct.owner = user;

    jest.spyOn(service, 'getById').mockImplementation(async () => product);
    jest.spyOn(service, 'save').mockImplementation(async () => expectedProduct);

    expect(await controller.updateProduct('1', newInfo, { user } as any)).toEqual(expectedProduct);
  });
});
