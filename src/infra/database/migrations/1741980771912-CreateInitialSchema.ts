import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateInitialSchema1741980771912 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar tabela de usuários
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'name', type: 'varchar', isNullable: false },
          { name: 'email', type: 'varchar', isUnique: true, isNullable: false },
          { name: 'password', type: 'varchar', isNullable: false },
          {
            name: 'status',
            type: 'enum',
            enum: ['active', 'inactive'],
            default: `'active'`,
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
      }),
    );

    // Criar tabela de moedas
    await queryRunner.createTable(
      new Table({
        name: 'coins',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'name', type: 'varchar' },
          { name: 'symbol', type: 'varchar' },
          { name: 'code', type: 'varchar' },
          {
            name: 'status',
            type: 'enum',
            enum: ['active', 'inactive'],
            default: `'active'`,
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
        uniques: [
          {
            name: 'UQ_name_symbol',
            columnNames: ['name', 'symbol'],
          },
        ],
      }),
    );

    // Criar tabela de categorias
    await queryRunner.createTable(
      new Table({
        name: 'categories',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'description', type: 'varchar' },
          { name: 'user_id', type: 'int' },
          {
            name: 'status',
            type: 'enum',
            enum: ['active', 'inactive'],
            default: `'active'`,
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
        uniques: [
          {
            name: 'UQ_category_user',
            columnNames: ['user_id', 'description'],
          },
        ],
        foreignKeys: [
          {
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
          },
        ],
      }),
    );

    // Criar tabela de Métodos de pagamento (payment_methods)
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
            name: 'status',
            type: 'enum',
            enum: ['active', 'inactive'],
            default: `'active'`,
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
            onDelete: 'SET NULL',
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

    // Criar tabela de viagens (trips)
    await queryRunner.createTable(
      new Table({
        name: 'trips',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'name', type: 'varchar' },
          { name: 'start_date', type: 'date' },
          { name: 'end_date', type: 'date' },
          {
            name: 'status',
            type: 'enum',
            enum: ['active', 'inactive'],
            default: `'active'`,
            isNullable: false,
          },
          { name: 'user_id', type: 'int' },
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
            name: 'FK_Trip_Users',
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            columnNames: ['user_id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
    );

    // Criar tabela de despesas
    await queryRunner.createTable(
      new Table({
        name: 'expenses',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'date', type: 'date' },
          { name: 'description', type: 'varchar' },
          { name: 'amount', type: 'decimal', precision: 10, scale: 2 },
          { name: 'notes', type: 'text', isNullable: true },
          { name: 'trip_id', type: 'int', isNullable: false },
          { name: 'coin_id', type: 'int', isNullable: false },
          { name: 'category_id', type: 'int', isNullable: false },
          { name: 'payment_method_id', type: 'int', isNullable: false },
          { name: 'user_id', type: 'int' },
          {
            name: 'status',
            type: 'enum',
            enum: ['active', 'inactive'],
            default: `'active'`,
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
            name: 'FK_Expense_trips',
            columnNames: ['trip_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'trips',
            onDelete: 'CASCADE',
          },
          {
            name: 'FK_Expense_Coins',
            columnNames: ['coin_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'coins',
            onDelete: 'SET NULL',
          },
          {
            name: 'FK_Expense_Categories',
            columnNames: ['category_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'categories',
            onDelete: 'SET NULL',
          },
          {
            name: 'FK_Expense_PaymentMethods',
            referencedTableName: 'payment_methods',
            referencedColumnNames: ['id'],
            columnNames: ['payment_method_id'],
            onDelete: 'SET NULL',
          },
          {
            name: 'FK_Expense_Users',
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('expenses'); // Depende de trips, coins, categories, payment_methods, users
    await queryRunner.dropTable('trips'); // Depende de users
    await queryRunner.dropTable('payment_methods'); // Depende de users
    await queryRunner.dropTable('categories'); // Depende de users
    await queryRunner.dropTable('coins'); // Independente
    await queryRunner.dropTable('users'); // Referenciada por quase todas
  }
}
