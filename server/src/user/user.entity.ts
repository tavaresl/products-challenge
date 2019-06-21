import { Entity, Column, BeforeInsert, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import { Exclude } from 'class-transformer';
import { genSalt, hash } from 'bcrypt';
import { Product } from '../product/product.entity';

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @OneToMany(type => Product, product => product.owner)
  products: Product[];

  constructor();
  constructor(firstName: string, lastName: string, email: string, password: string);
  constructor(firstName?: string, lastName?: string, email?: string, password?: string) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
  }

  @BeforeInsert()
  async encryptPassword(): Promise<void> {
    const salt = await genSalt();
    const encryptedPassword = await hash(this.password, salt);

    this.password = encryptedPassword;
  }
}
