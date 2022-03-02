import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatGateway } from './chat/chat.gateway';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
      ConfigModule.forRoot({isGlobal:true}),
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: 'postgres',
        port: 5432,
        database: 'db',
        username: 'user',
        password: 'password',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true
    }),
      UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway]
})
export class AppModule {}
