import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddTypeOnExpensesAndCategories1744711358124
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'categories',
      new TableColumn({
        name: 'type',
        type: 'enum',
        enum: ['income', 'outcome'],
        isNullable: false,
        default: `'outcome'`,
      }),
    );

    await queryRunner.query(
      `UPDATE categories SET type = 'outcome' WHERE type IS NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('categories', 'type');
  }
}
