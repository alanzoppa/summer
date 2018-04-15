import { request } from 'graphql-request';
import httpRequest from 'request-promise-native';
import {findToken, formatAuth} from './user';
import {loginUser, fakeAuth, overrideSession} from './testhelpers';
import {events} from './calendar';
global['fetch'] = require('fetch-cookie/node-fetch')(require('node-fetch'));


let server;

//test('stringToDate', function() {
    //const date = Date.parse("2018-04-18T11:00:00-07:00");
    //console.log(date);
    //console.log( new Date(date).getUTCHours() )
    //console.log( new Date(date).getUTCMinutes() )

    //console.log( new Date(date).getHours() )
    //console.log( new Date(date).getMinutes() )

//})

beforeEach(() => {
    const app = require('./app').default;
    server = app.listen(8080, () => console.log('Example app listening on port 8080!'))
    return server;
})

afterEach(() => {
    return server.close();
})

test('can fetch events', async (done) => {
    let login = await loginUser('112328053981550743186', fetch);
    login = await login.json();
    const auth = login.auth;
    const results = await events(auth, {maxResults: 1});
    expect( results.kind ).toEqual('calendar#events')
    expect( results.items.length ).toBe(1);
    expect( results.items[0] ).toBeInstanceOf(Object);
    done();
})


test('can fetch with graphQL', async (done) => {
    const data = await request(
        'http://localhost:8080/graphql',
        `{
            events {
                kind
                etag
                summary
                timeZone
                start
                end
                attendees {
                    displayName
                    email
                }
            }
        }` 
    ) 
    //console.log(data);
    console.log(data.events[0].attendees);


    //expect(data.events[0].kind).toMatch(/.+/);
    //expect(data.events[0].etag).toMatch(/.+/);
    //expect(data.events[0].summary).toMatch(/.+/);
    //expect(data.events[0].timeZone).toMatch(/.+/);
    //expect(data.events[0].start).toMatch(/.+/);
    //expect(data.events[0].end).toMatch(/.+/);

    [ "kind", "etag", "summary", "timeZone", "start", "end", ]
        .forEach(
            key => {
                expect(data.events[0][key]).toMatch(/.+/);
            }
        )




    done();
})
