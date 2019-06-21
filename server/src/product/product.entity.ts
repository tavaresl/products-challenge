import { PrimaryGeneratedColumn, Column, ManyToOne, Entity } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Product {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  category: string;

  @Column({ nullable: true })
  useMode?: string;

  @Column({ nullable: true })
  legalInformation?: string;

  @ManyToOne(type => User, user => user.products)
  owner: User;

  constructor()
  constructor(name: string, description: string, category: string, useMode?: string, legalInformation?: string)
  constructor(name?: string, description?: string, category?: string, useMode?: string, legalInformation?: string) {
    this.name = name;
    this.description = description;
    this.category = category;
    this.useMode = useMode;
    this.legalInformation = legalInformation;
  }
}
