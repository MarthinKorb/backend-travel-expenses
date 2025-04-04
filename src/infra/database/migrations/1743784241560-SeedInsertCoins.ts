import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedInsertCoins1743784241560 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO coins (name, symbol, code) VALUES
        ('Dólar Americano', '$', 'USD'),
        ('Euro', '€', 'EUR'),
        ('Libra Esterlina', '£', 'GBP'),
        ('Iene Japonês', '¥', 'JPY'),
        ('Dólar Australiano', 'A$', 'AUD'),
        ('Dólar Canadense', 'C$', 'CAD'),
        ('Franco Suíço', 'CHF', 'CHF'),
        ('Yuan Chinês', '¥', 'CNY'),
        ('Dólar de Hong Kong', 'HK$', 'HKD'),
        ('Dólar de Singapura', 'S$', 'SGD'),
        ('Real Brasileiro', 'R$', 'BRL'),
        ('Rupia Indiana', '₹', 'INR'),
        ('Rupia Indonésia', 'Rp', 'IDR'),
        ('Peso Mexicano', '$', 'MXN'),
        ('Ringgit Malaio', 'RM', 'MYR'),
        ('Rublo Russo', '₽', 'RUB'),
        ('Rand Sul-Africano', 'R', 'ZAR'),
        ('Baht Tailandês', '฿', 'THB'),
        ('Peso Filipino', '₱', 'PHP'),
        ('Coroa Sueca', 'kr', 'SEK'),
        ('Coroa Norueguesa', 'kr', 'NOK'),
        ('Coroa Dinamarquesa', 'kr', 'DKK'),
        ('Forint Húngaro', 'Ft', 'HUF'),
        ('Zloty Polonês', 'zł', 'PLN'),
        ('Peso Argentino', '$', 'ARS'),
        ('Shekel Israelense', '₪', 'ILS'),
        ('Dólar Neozelandês', 'NZ$', 'NZD'),
        ('Dólar Taiwanês', 'NT$', 'TWD'),
        ('Dirham dos Emirados', 'د.إ', 'AED'),
        ('Lira Turca', '₺', 'TRY'),
        ('Won Sul-Coreano', '₩', 'KRW'),
        ('Dólar de Fiji', 'FJ$', 'FJD'),
        ('Dólar de Barbados', 'Bds$', 'BBD'),
        ('Dólar Jamaicano', 'J$', 'JMD'),
        ('Rupia do Sri Lanka', 'Rs', 'LKR'),
        ('Dinar Kuwaitiano', 'د.ك', 'KWD'),
        ('Dinar Bahreinita', '.د.ب', 'BHD'),
        ('Dinar Jordaniano', 'د.ا', 'JOD'),
        ('Dinar Argelino', 'د.ج', 'DZD'),
        ('Dinar Sérvio', 'дин.', 'RSD'),
        ('Kwanza Angolano', 'Kz', 'AOA'),
        ('Franco CFA da África Ocidental', 'CFA', 'XOF'),
        ('Franco CFA da África Central', 'CFA', 'XAF'),
        ('Lev Búlgaro', 'лв', 'BGN'),
        ('Peso Colombiano', '$', 'COP'),
        ('Quetzal Guatemalteco', 'Q', 'GTQ'),
        ('Boliviano', 'Bs.', 'BOB'),
        ('Sol Peruano', 'S/', 'PEN'),
        ('Guarani Paraguaio', '₲', 'PYG'),
        ('Leu Romeno', 'lei', 'RON');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM coins`);
  }
}
