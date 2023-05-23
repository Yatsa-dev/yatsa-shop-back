import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  price: number;

  @Column({ nullable: true })
  file: string;

  @Column({ nullable: true })
  description: string;
}
