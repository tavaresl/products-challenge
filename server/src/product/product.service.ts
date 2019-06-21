import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { User } from '../user/user.entity';

@Injectable()
export class ProductService {

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) { }

  async save(product: Product) {
    const savedProduct = await this.productRepository.save(product, { reload: true });
    return savedProduct;
  }

  async getById(id: number) {
    const product = await this.productRepository.findOne(id, { relations: ['owner'] });
    return product;
  }

  async getByUser(user: User) {
    const products = await this.productRepository.createQueryBuilder('product')
      .select()
      .leftJoin('product.owner', 'owner')
      .where('owner.id = :userId', { userId: user.id })
      .getMany();

    return products;
  }

  async delete(product: Product) {
    await this.productRepository.delete(product);
  }
}
