import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config';
import { RpcCustomExceptionFilter } from './common';

async function bootstrap() {
  const logger = new Logger('Main-Gateway');
  const app = await NestFactory.create(AppModule);

  app
    .setGlobalPrefix('api')
    .useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true      
      })
    )
    // .useGlobalFilters(new AllExceptionFilter())
    .useGlobalFilters(new RpcCustomExceptionFilter())

  await app.listen(envs.PORT);

  logger.debug(`Server running on port ${envs.PORT}`);
}
bootstrap();
