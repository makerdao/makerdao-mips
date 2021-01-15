import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CommandModule } from "nestjs-command";

import { Env } from "./env";
import { MIPsModule } from "./mips/mips.module";

@Module({
  imports: [
    CommandModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>(Env.MongoDBUri),
        useCreateIndex: true,
        useFindAndModify: false,
      }),
      inject: [ConfigService],
    }),
    MIPsModule,
  ],
  providers: [],
})
export class AppModule {}
