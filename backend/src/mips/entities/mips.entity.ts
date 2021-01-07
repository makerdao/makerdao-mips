import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class MIPsDoc extends Document {
  @Prop({
    index: { type: "text" },
  })
  file: string;
  @Prop()
  filename: string;
  @Prop({
    unique: true,
  })
  hash: string;

  @Prop({
    unique: true,
  })
  mip?: number;
  @Prop({
    unique: true,
  })
  title?: string;
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

export const MIPsSchema = SchemaFactory.createForClass(MIPsDoc);
