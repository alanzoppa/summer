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
            //console.log(Object.keys(arguments));
            //console.log('--')
            console.log(obj);
            console.log('--')
            console.log(args);
            console.log('--')
            console.log(session);
            //console.log('--')
            return findToken(args.id);
            //return {
                //id: '123',
                //token: {
                    //access_token: 'aaa',
                    //refresh_token: 'bbb',
                    //expiry_date: 'ccc'
                //}

            //}
        }
    },
    User: {
        token: (obj, args, context, info) => {

            //console.log('-----------------')
            //console.log(obj);
            //console.log('-----------------')
            //console.log(args);
            //console.log('-----------------')
            //console.log(context);
            //console.log('-----------------')
            //console.log(info);
            //console.log('-----------------')


            return obj.token 
        }
    }
}


export const schema = makeExecutableSchema({
    typeDefs, resolvers
})


//const mySchema = buildSchema(`

    //type User {
        //id: ID!
        //token: Token 
    //}

    //type Token {
        //access_token: String!
        //refresh_token: String!
        //expiry_date: String!
    //}

    //type Query {
        //user(id: ID!): User
    //}

//`);
