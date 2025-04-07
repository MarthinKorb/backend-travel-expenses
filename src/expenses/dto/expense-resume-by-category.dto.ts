import { Category } from 'src/categories/entities/category.entity';

export interface ExpenseResumeByCategoryDto {
  category: Category;
  total: number;
  percentage: number;
}
