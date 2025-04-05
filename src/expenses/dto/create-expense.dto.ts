import { Category } from 'src/categories/entities/category.entity';
import { Coin } from 'src/coins/entities/coin.entity';
import { Trip } from 'src/trips/entities/trip.entity';

export class CreateExpenseDto {
  id: number;

  date: Date;

  description: string;

  amount: number;

  payment_method: string;

  notes: string | null;

  coin: Coin;

  category: Category;

  trip: Trip;
}
