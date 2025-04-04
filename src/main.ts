import { NestFactory } from '@nestjs/core';
import * as cors from 'cors';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './shared/filters/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter());
  app.use(cors());
  await app.listen(process.env.PORT ?? 3000);
  console.log(`App running on ${process.env.PORT ?? 3000} port.`);
}
bootstrap();
