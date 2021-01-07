import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type MIPsDoc = MIP & Document;

@Schema()
export class MIP {
  @Prop({
    index: { type: "text" },
  })
  file: string;
  @Prop()
  filename: string;
  @Prop()
  hash: string;

  @Prop()
  mip?: number;
  @Prop()
  title?: string;
  @Prop()
  preambleTitle?: string;
  @Prop({
    type: [String],
  })
  author?: string[];
  @Prop({
    type: [String],
  })
  contributors?: string[];
  @Prop()
  status?: string;
  @Prop()
  types?: string;
  @Prop()
  dateProposed?: string;
  @Prop()
  dateRatified?: string;
  @Prop({
    type: [String],
  })
  dependencies?: string[];
  @Prop()
  replaces?: string;
}

export const MIPsSchema = SchemaFactory.createForClass(MIP);
