import { request } from 'graphql-request';
import httpRequest from 'request-promise-native';
import {findToken, formatAuth} from './user';
import {loginUser, fakeAuth, overrideSession} from './testhelpers';
import {events} from './calendar';
global['fetch'] = require('fetch-cookie/node-fetch')(require('node-fetch'));


let server;

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
            }
        }` 
    ) 
    console.log(data);
    done();
})
