const { execSync } = require('child_process');

const name = process.env.npm_config_name;

if (!name) {
  console.error('❌ Você precisa informar um nome com: --name=NomeDaMigration');
  process.exit(1);
}

const command = `npx typeorm migration:create src/infra/database/migrations/${name}`;
console.log('✅ Gerando migration:', command);
execSync(command, { stdio: 'inherit' });

console.log('✅ Migration criada com sucesso!');
