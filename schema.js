import { makeExecutableSchema } from 'graphql-tools';
import {findToken} from './user';


const typeDefs = ` 
    type Token {
        access_token: String!
        refresh_token: String!
        expiry_date: String!
    } 

    type User {
        id: ID!
        token: Token
    }

    type Query {
        user(id: ID): User
    } 
`

const resolvers = {
    Query: {
        user: (obj, args, session, info) => {
            //console.log(obj);
            //console.log('--')
            //console.log(args);
            console.log('--')
            console.log(session);
            console.log('--')
            if (args.id == 'me') {
                console.log(session.auth)
                //console.dir( Object.keys(session) )
                //console.dir( Object.getOwnPropertyNames(session) )
                return session.auth;
            }
            return findToken(args.id);
        }
    },
    User: {
        token: (obj, args, context, info) => {
            return obj.token 
        }
    }
}


export const schema = makeExecutableSchema({
    typeDefs: [typeDefs],
    resolvers: resolvers
})


    //type: {
    //}

    //type RootMutation {
      //addItem (
            //name: String!,
            //desc: String,
            //ownerId: ID!
          //): Item
    //}


