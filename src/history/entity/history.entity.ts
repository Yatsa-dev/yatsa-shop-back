import { User } from '../../users/entity/users.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class History {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  createdAt: string;

  @Column()
  amount: number;

  @ManyToOne(() => User, {
    nullable: false,
    // createForeignKeyConstraints: false,
  })
  @JoinColumn()
  user: number;
}
