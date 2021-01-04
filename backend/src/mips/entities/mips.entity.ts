import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class MIPsDoc extends Document {
  @Prop({
    index: { type: 'text' },
  })
  file: string;
  @Prop()
  filename: string;
  @Prop({
    unique: true,
  })
  hash: string;
}

export const MIPsSchema = SchemaFactory.createForClass(MIPsDoc);
