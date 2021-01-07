import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { MIPsDoc, MIPsSchema } from "./entities/mips.entity";
import { MIPsController } from "./mips.controller";

import { MIPsService } from "./services/mips.service";
import { ParseMIPsService } from "./services/parse-mips.service";
import { SimpleGitService } from "./services/simple-git.service";
import { MarkedService } from "./services/marked.service";

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: MIPsDoc.name,
        collection: MIPsDoc.name,
        useFactory: () => {
          const schema = MIPsSchema;
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
