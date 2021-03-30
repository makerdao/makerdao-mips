import * as mongoose from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


export type PullRequestDoc = PullRequest & mongoose.Document;

export class File {
  @Prop()
  path: string;
}
export class Files {
  @Prop({
    type: [File]
  })
  nodes: File[];

  @Prop()
  totalCount: number;
}

export class Author {
  @Prop()
  login: string;
}

@Schema()
export class PullRequest {
  @Prop({type: String})
  state: string;
  @Prop({type: String})
  url: string;
  @Prop({type: String})
  title: string;
  @Prop({type: String})
  createdAt: string;
  @Prop({type: String})
  body: string;

  @Prop({
    type: Author
  })
  author: Author;

  @Prop({
    type: Files
  })
  files: Files;
}

export const PullRequestSchema = SchemaFactory.createForClass(PullRequest);
