import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type MIPsDoc = MIP & Document;

export class Section {
  @Prop()
  heading: string;

  @Prop()
  depth: string;
}

@Schema()
export class MIP {
  @Prop()
  file: string;
  @Prop()
  filename: string;
  @Prop()
  hash: string;

  @Prop({
    default: -1,
    type: Number,
  })
  mip?: number;
  
  @Prop()
  mipName?: string;

  @Prop()
  subproposal?: number;

  @Prop({
    index: { type: "text" },
  })
  title?: string;

  @Prop({
    default: "",
    type: String,
  })
  proposal?: string;

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

  @Prop()
  sentenceSummary?: string;
  @Prop()
  paragraphSummary?: string;

  @Prop({
    type: [Object]
  })
  sections?: Section[];

  @Prop({
    type: [String]
  })
  sectionsRaw?: string[];
}

export const MIPsSchema = SchemaFactory.createForClass(MIP);
