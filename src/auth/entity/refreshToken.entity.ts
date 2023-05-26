import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'datetime' })
  createdAt: Date;

  @Column()
  userId: number;
}
