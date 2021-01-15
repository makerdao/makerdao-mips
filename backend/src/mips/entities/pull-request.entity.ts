import * as mongoose from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type PullRequestDoc = PullRequest & mongoose.Document;

@Schema()
export class Item {
  @Prop()
  url: string;
  @Prop()
  title: string;
  @Prop()
  body: string;
  @Prop()
  createdAt: string;
}

@Schema()
export class PullRequest {
  @Prop()
  url: string;
  @Prop({
    type: Number,
  })
  totalOpen: number;
  @Prop({
    type: Number,
  })
  totalClosed: number;
  @Prop({
    type: Number,
  })
  totalCount: number;

  @Prop()
  items: Item[];
}

export const PullRequestSchema = SchemaFactory.createForClass(PullRequest);
