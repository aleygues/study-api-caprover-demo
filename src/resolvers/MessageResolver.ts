/** resolvers/MessageResolver.ts */
import { Message } from "../entities/Message";
import { Arg, Args, Authorized, Int, Mutation, PubSub, PubSubEngine, Query, Resolver, Root, Subscription } from "type-graphql";

@Resolver(Message)
export class MessageResolver {
    private messages: Message[] = [];

    @Query(() => [Message])
    public async getAll(): Promise<Message[]> {
        return this.messages;
    }

    @Mutation(() => Message)
    public async createMessage(@Arg('data', () => Message) data: Message, @PubSub() pubSub: PubSubEngine): Promise<Message> {
        this.messages.push(data);
        await pubSub.publish("MESSAGES", data);
        return data;
    }

    @Subscription({
        topics: "MESSAGES",
        filter: ({ payload, args }) => payload.roomId === args.roomId
    })
    @Authorized()
    public newMessages(
        @Root() payload: Message,
        @Arg('roomId', () => Int) roomId: number 
    ): Message {
        return payload;
    }
}