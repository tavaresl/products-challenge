import { join } from 'path';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: `${process.cwd()}/database.sqlite`,
      entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
      synchronize: true,
    }),
    UserModule, ProductModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
