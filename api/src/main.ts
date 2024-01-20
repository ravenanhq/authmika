import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UnprocessableEntityException, ValidationError, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const formattedErrors = {};

        validationErrors.forEach((error) => {
          formattedErrors[error.property] = Object.values(
            error.constraints,
          ).join(', ');
        });

        return new UnprocessableEntityException({
          message: formattedErrors,
          error: 'Unprocessable Entity',
          statusCode: 422,
        });
      },
    }),
  );

  // Configure CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.APP_PORT || 3001);
}
bootstrap();
