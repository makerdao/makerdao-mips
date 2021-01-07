import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { MIP, MIPsSchema } from "./entities/mips.entity";
import { MIPsController } from "./mips.controller";

import { MIPsService } from "./services/mips.service";
import { ParseMIPsService } from "./services/parse-mips.service";
import { SimpleGitService } from "./services/simple-git.service";
import { MarkedService } from "./services/marked.service";

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: MIP.name,
        collection: MIP.name,
        useFactory: () => {
          const schema = MIPsSchema;

          schema.index({ filename: 1, hash: 1 }, { unique: true });

          return schema;
        },
      },
    ]),
  ],
  controllers: [MIPsController],
  providers: [
    MIPsService,
    SimpleGitService,
    ParseMIPsService,
    SimpleGitService,
    MarkedService,
  ],
})
export class MIPsModule {}
