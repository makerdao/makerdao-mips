import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Document } from "mongoose";

export enum Language {
  English='en',
  Spanish='es',
}

export type MIPsDoc = MIP & Document;

export class Section {
  @Prop()
  heading: string;

  @Prop()
  depth: string;

  @Prop()
  mipComponent?: string;
}

export class Reference {
  @Prop()
  name: string;

  @Prop()
  link: string;
}

export class Component {
  @Prop()
  cName: string;

  @Prop()
  cTitle: string;


  @Prop()
  cBody: string;
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
    default: Language.English
  })
  language?: Language;

  @Prop({
    default: -1,
    type: Number,
  })
  mip?: number;
  
  @Prop()
  mipName?: string;

  @Prop({
    default: -1,
    type: Number,
  })
  subproposal?: number;

  @Prop({
    default: false,
    type: Boolean,
  })
  mipFather?: boolean;

  @Prop()
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

  @Prop({
    type: [String],
  })
  tags?: string[];
  
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

  @Prop({
    type: [Object]
  })
  references?: Reference[];

  @Prop({
    type: [Object]
  })
  components?: Component[];

  @Prop()
  subproposalsCount?: number;

  @Prop()
  votingPortalLink?: string;

  @Prop()
  forumLink?: string;

  @Prop()
  mipCodeNumber?: string;
}

export class Mips {
  @ApiProperty()
  file: string;
  @ApiProperty()
  filename: string;
  @ApiProperty()
  hash: string;

  @ApiPropertyOptional({
    default: Language.English,
  })
  language?: Language;

  @ApiPropertyOptional({
    default: -1,
    type: Number,
  })
  mip?: number;
  
  @ApiPropertyOptional({
    required:false
  })
  mipName?: string;
  

  @ApiPropertyOptional({
    default: -1,
    type: Number,
  })
  subproposal?: number;

  @ApiPropertyOptional({
    default: false,
    type: Boolean,
  })
  mipFather?: boolean;

  @ApiPropertyOptional()
  title?: string;

  @ApiPropertyOptional({
    default: "",
    type: String,
    required:false
  })
  proposal?: string;

  @ApiPropertyOptional({
    type: [String],
  })
  author?: string[];

  @ApiPropertyOptional({
    type: [String],
  })
  contributors?: string[];

  @ApiPropertyOptional({
    type: [String],
  })
  tags?: string[];
  
  @ApiProperty({
    required:false
  })
  status?: string;
  @ApiProperty({
    required:false
  })
  types?: string;
  @ApiProperty({
    required:false
  })
  dateProposed?: string;
  @ApiProperty({
    required:false
  })
  dateRatified?: string;
  @ApiProperty({
    type: [String],
    required:false
  })
  dependencies?: string[];
  @ApiProperty({
    required:false
  })
  replaces?: string;

  @ApiProperty({
    required:false
  })
  sentenceSummary?: string;
  @ApiProperty({
    required:false
  })
  paragraphSummary?: string;

  @ApiProperty({
    type: [Object],
    required:false
  })
  sections?: Section[];

  @ApiProperty({
    type: [String],
    required:false
  })
  sectionsRaw?: string[];

  @ApiProperty({
    type: [Object],
    required:false
  })
  references?: Reference[];

  @ApiProperty({
    type: [Object],
    required:false
  })
  components?: Component[];

  @ApiProperty({
    required:false
  })
  subproposalsCount?: number;

  @ApiProperty({
    required:false
  })
  votingPortalLink?: string;

  @ApiProperty({
    required:false
  })
  forumLink?: string;

  @ApiProperty({
    required:false
  })
  mipCodeNumber?: string;
}

@Schema()
export class ErrorObject {
  @ApiProperty()
  statusCode?:number
  @ApiProperty()
  message?: string
  @ApiProperty()
  error?: string
}


export class ErrorObjectModel {
 
  @ApiPropertyOptional()
  statusCode?:number
  @ApiPropertyOptional()
  message?: string
  @ApiPropertyOptional()
  error?: string
}



export const MIPsSchema = SchemaFactory.createForClass(MIP);
export const ErrorModelSchema = SchemaFactory.createForClass(ErrorObject);
MIPsSchema.index({ title: "text", mipName: "text" });

