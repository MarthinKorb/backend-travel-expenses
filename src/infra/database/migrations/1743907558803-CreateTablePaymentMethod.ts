import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class CreateTablePaymentMethod1743907558803
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'payment_methods',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'user_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            name: 'FK_User_PaymentMethods',
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            columnNames: ['user_id'],
            onDelete: 'CASCADE',
          },
        ],
        uniques: [
          {
            name: 'UQ_PaymentMethods_Description_UserId',
            columnNames: ['description', 'user_id'],
          },
        ],
      }),
    );

    await queryRunner.dropColumn('expenses', 'payment_method');

    await queryRunner.addColumn(
      'expenses',
      new TableColumn({
        name: 'payment_method_id',
        type: 'int',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'expenses',
      new TableForeignKey({
        name: 'FK_Expense_PaymentMethods',
        referencedTableName: 'payment_methods',
        referencedColumnNames: ['id'],
        columnNames: ['payment_method_id'],
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('expenses', 'FK_Expense_PaymentMethods');
    await queryRunner.dropColumn('expenses', 'payment_method_id');
    await queryRunner.dropForeignKey(
      'payment_methods',
      'FK_User_PaymentMethods',
    );
    await queryRunner.dropTable('payment_methods');
  }
}
