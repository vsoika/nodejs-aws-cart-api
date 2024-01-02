import { NestFactory } from '@nestjs/core';
import serverlessExpress from '@vendia/serverless-express';

import helmet from 'helmet';

import { AppModule } from './app.module';

const port = process.env.PORT || 4000;

async function bootstrap() {
  console.log('START');
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (req, callback) => callback(null, true),
  });
  app.use(helmet());

  await app.listen(port);

  console.log('Initialization');

  // await app.init();
  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

bootstrap().then(() => {
  console.log('App is running on %s port', port);
});
