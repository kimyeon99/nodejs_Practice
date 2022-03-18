import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transform } from 'class-transformer';
import { AppModule } from './app.module';
import { CreateMovieDto } from './movies/dto/create-movie.dto';
import { SocketIoAdapter } from './adapters/IoAdapter';
import { NestExpressApplication } from '@nestjs/platform-express'

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.useWebSocketAdapter(new SocketIoAdapter(app));
  await app.listen(3001);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
