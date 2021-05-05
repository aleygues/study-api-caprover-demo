import 'reflect-metadata';
import { AuthChecker, buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/UserResolver";
import { getModelForClass, mongoose } from '@typegoose/typegoose';
import { decodeJwt } from './helpers';
import { User } from './entities/User';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import http from 'http';
import { MessageResolver } from './resolvers/MessageResolver';

export const passwordAuthChecker: AuthChecker = async ({ context }: any, roles) => {
    try {
        const token = context.req.cookies.appSession;

        if (token) {
            const data = decodeJwt(token);
            const model = getModelForClass(User);
            const user = await model.findById(data.userId);
            context.user = user;
            return true;
        } else {
            return false;
        }
    } catch {
        return false;
    }
};

(async () => {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/', { useNewUrlParser: true, useUnifiedTopology: true, dbName: "wilder" });

    const schema = await buildSchema({
        resolvers: [UserResolver, MessageResolver],
        authChecker: passwordAuthChecker,
    });

    const apolloServer = new ApolloServer({
        schema,
        playground: true,
        context: ({ req, res }) => ({ req, res })
    });

    const app = express();
    apolloServer.applyMiddleware({ app });

    const httpServer = http.createServer(app);
    apolloServer.installSubscriptionHandlers(httpServer);

    httpServer.listen({ port: 3002 }, () => {
        console.log(`🚀 Server ready at http://localhost:3002${apolloServer.graphqlPath}`);
    });
})();