import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { CUSTOMER } from '../users.constanst';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: true })
  password: string;

  @Column()
  email: string;

  @Column({ default: CUSTOMER })
  role: string;
}
