import { prop } from "@typegoose/typegoose";
import { IsEmail } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";

@ObjectType('User')
@InputType('UserInput')
export class User {
    @Field()
    @prop()
    @IsEmail()
    email: string;

    @Field()
    @prop()
    password: string;
}