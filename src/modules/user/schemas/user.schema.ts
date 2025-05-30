import {
  getModelForClass,
  modelOptions,
  prop,
  Severity,
} from '@typegoose/typegoose';
import { CommonSchema } from '../../../common/schemas/common.schema';
import { UserRole } from '../../auth/enums/user-type.enum';

@modelOptions({
  options: { allowMixed: Severity.ALLOW },
  schemaOptions: { collection: 'users' },
})
export class UserSchema extends CommonSchema {
  @prop({ required: true, unique: true })
  public email!: string;

  @prop({ required: true })
  public password!: string;

  @prop({ required: true })
  public name!: string;

  @prop({
    required: true,
    enum: UserRole,
    default: UserRole.USER,
  })
  public role!: UserRole;

  @prop({ default: false })
  public isVerified?: boolean;
}

export const UserModel = getModelForClass(UserSchema);
