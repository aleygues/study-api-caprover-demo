/** entities/Message.ts */
import { Field, InputType, Int, ObjectType } from "type-graphql";

@ObjectType('Message')
@InputType('MessageInput')
export class Message {
    @Field()
    message: string;

    @Field(() => Int)
    roomId: number;

    @Field()
    userName: string;
}