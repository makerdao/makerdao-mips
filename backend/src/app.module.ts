import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { Env } from "./env";
import { MIPsModule } from "./mips/mips.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>(Env.MongoDBUri),
        useCreateIndex: true,
      }),
      inject: [ConfigService],
    }),
    MIPsModule,
  ],
})
export class AppModule {}
