import { makeExecutableSchema } from 'graphql-tools';
import {findToken} from './user';
import {events} from './calendar';


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

    type Attendee {
        email: String
        displayName: String
        isSelf: Boolean
    }

    type Event {
        kind: String!
        etag: String!
        summary: String!
        timeZone: String!
        start: String!
        end: String!
        htmlLink: String!
        attendees: [Attendee]
    }

    type Query {
        user(id: ID): User
        events: [Event]
    } 
`

const resolvers = {
    Query: {
        user: (obj, args, session, info) => {
            if (args.id == 'me') {
                return session.auth;
            }
            return findToken(args.id);
        },
        events: async (obj, args, session, info) => {
            let results = await events(session.auth, {maxResults: 1})
            let evs = results.items.map( ev => {
                ev.timeZone = results.timeZone;
                ev.start = ev.start.dateTime || ev.start.date;
                ev.end = ev.end.dateTime || ev.end.date;
                //console.log(ev);
                return ev;
            });
            return evs;
        }

    },
    User: {
        token: (obj, args, session, info) => {
            return obj.token 
        }
    },
    Event: {
        attendees: (obj, args, session, info) => {
            return obj.attendees;
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


