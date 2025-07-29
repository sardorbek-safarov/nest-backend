import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable cookie parser
  const cookieParser = require('cookie-parser');
  app.use(cookieParser());

  // Set global API prefix
  const apiPrefix = process.env.API_PREFIX || 'api/v1';
  app.setGlobalPrefix(apiPrefix);

  // Enable CORS with credentials support for cookies
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'], // Add your frontend URLs
    credentials: true, // Important for cookies
  });

  const port = process.env.PORT || 8080;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(
    `API endpoints available at: http://localhost:${port}/${apiPrefix}`
  );
}

bootstrap();
