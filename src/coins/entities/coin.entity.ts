import {
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Status } from '../../enums/status-enum';
import { Expense } from '../../expenses/entities/expense.entity';

@Entity('coins')
export class Coin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  symbol: string;

  @Column()
  code: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.ACTIVE,
  })
  status: Status;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updated_at = new Date();
  }

  @OneToMany(() => Expense, (expense) => expense.coin)
  expenses: Expense[];
}
