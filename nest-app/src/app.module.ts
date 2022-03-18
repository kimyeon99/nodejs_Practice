import { Module } from '@nestjs/common';
import { MoviesModule } from './movies/movies.module';
import { AppController } from './app.controller';
import { AppGateway } from './app.gateway';

@Module({
  imports: [MoviesModule],
  controllers: [AppController],
  providers: [AppGateway],
})
export class AppModule { }
