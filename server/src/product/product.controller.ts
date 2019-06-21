import {
  Controller,
  UseGuards,
  Post,
  Body,
  UnprocessableEntityException,
  Req,
  ClassSerializerInterceptor,
  UseInterceptors,
  Get,
  Delete,
  Param,
  HttpCode,
  Patch,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ProductService } from './product.service';
import { ProductDTO } from './dto/product.dto';
import { Product } from './product.entity';

@Controller('products')
@UseGuards(AuthGuard())
@UseInterceptors(ClassSerializerInterceptor)
export class ProductController {
  constructor(
    private readonly productService: ProductService,
  ) { }

  @Post()
  public async create(@Body() productInfo: ProductDTO, @Req() request: Request) {
    try {
      const product = new Product(
        productInfo.name,
        productInfo.description,
        productInfo.category,
      );

      if (productInfo.useMode) {
        product.useMode = productInfo.useMode;
      }

      if (productInfo.legalInformation) {
        product.legalInformation = productInfo.legalInformation;
      }

      product.owner = request.user;

      const newProduct = await this.productService.save(product);

      return newProduct;
    } catch (err) {
      throw new UnprocessableEntityException(err.message);
    }
  }

  @Get()
  public async getAllByUser(@Req() request: Request) {
    try {
      const products = await this.productService.getByUser(request.user);
      return products;
    } catch (err) {
      throw new UnprocessableEntityException(err.message);
    }
  }

  @Delete(':id')
  @HttpCode(204)
  public async deleteProduct(
    @Param('id') productId: string,
    @Req() request: Request,
  ) {
    try {
      const product = await this.productService.getById(Number(productId));

      if (!product || product.owner.id !== request.user.id) {
        throw new Error('cannot find any product with given id.');
      }

      await this.productService.delete(product);
    } catch (err) {
      throw new UnprocessableEntityException(err.message);
    }
  }

  @Patch(':id')
  public async updateProduct(
    @Param('id') productId: string,
    @Body() newInfo: Partial<Product>,
    @Req() request: Request,
  ) {
    try {
      const product = await this.productService.getById(Number(productId));

      if (!product || product.owner.id !== request.user.id) {
        throw new Error('cannot find any product with given id.');
      }

      Object
        .keys(newInfo)
        .filter(key => key !== 'id' && key !== 'owner')
        .forEach(key => {
          product[key] = newInfo[key];
        });

      const updatedProduct = await this.productService.save(product);

      return updatedProduct;
    } catch (err) {
      throw new UnprocessableEntityException(err.message);
    }
  }
}
