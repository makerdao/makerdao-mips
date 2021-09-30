
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MetaDocument = Meta & Document;



@Schema()
export class Meta {
  @Prop()
  language: string;

  @Prop()
  translations:string
}

export const MetaSchema = SchemaFactory.createForClass(Meta);