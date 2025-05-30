import {
  getModelForClass,
  modelOptions,
  prop,
  Severity,
} from '@typegoose/typegoose';
import mongoose from 'mongoose';
import { CommonSchema } from '../../../common/schemas/common.schema';

@modelOptions({
  options: { allowMixed: Severity.ALLOW },
  schemaOptions: { collection: 'token_blacklist' },
})
export class TokenBlacklistSchema extends CommonSchema {
  @prop({ required: true })
  public token!: string;

  @prop({ required: true })
  public userId!: mongoose.ObjectId;

  @prop({ required: true, default: Date.now, expires: '7d' })
  public expiresAt!: Date;
}

export const TokenBlacklistModel = getModelForClass(TokenBlacklistSchema);
