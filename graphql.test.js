import { request } from 'graphql-request';
import httpRequest from 'request-promise-native';
import {findToken, formatAuth} from './user';
import {loginUser, fakeAuth, overrideSession} from './testhelpers';
global['fetch'] = require('fetch-cookie/node-fetch')(require('node-fetch'));
const nock = require('nock');
const testReplies = require('./test_replies.json');
import {events} from './calendar';


let server;

beforeEach(() => {
    const app = require('./app').default;
    server = app.listen(8080, () => console.log('Example app listening on port 8080!'))
    return server;
})

afterEach((done) => {
    return server.close(done);
})


const q = (user_id) => {
    return `{
        user(id: "${user_id}")  {
            id
            token {
                access_token
                refresh_token
                expiry_date
            }
        }
    }`
}


test('overrideSession', async (done) => {
    const req = await overrideSession({auth: fakeAuth}, {}, fetch)
    const session = await req.json();

    const tryAgain = await fetch('http://localhost:8080/session',
        { credentials: 'same-origin'}
    )
    const newSession = await tryAgain.json();

    expect(newSession.cookie).toBeInstanceOf(Object);
    expect(newSession.auth).toBeInstanceOf(Object);
    expect(newSession.auth.id).toMatch(/.+/);
    expect(newSession.auth.token.access_token).toMatch(/.+/);
    expect(newSession.auth.token.refresh_token).toMatch(/.+/);

    done();
})



test('empty sessions query the datastore for users', (async (done) => {
    const data = await request(
        'http://localhost:8080/graphql',
        q('112328053981550743186')
    )
    expect(data.user.id).toMatch(/\d+/)
    expect(data.user.token.access_token).toMatch(/.+/)
    done();
}))


test('User(id: "me") returns the session token', async (done) => {

    const auth = formatAuth(
        'fakeid',
        {
            access_token: '11111111',
            refresh_token: '22222222',
            expiry_date: 1523691899905
        }
    )

    await overrideSession({auth}, {}, fetch);

    const data = await request(
        'http://localhost:8080/graphql',
        q('me')
    )

    expect(data.user.id).toEqual('fakeid')
    expect(data.user.token.access_token).toEqual('11111111');
    expect(data.user.token.refresh_token).toEqual('22222222');
    expect(data.user.token.expiry_date).toEqual("1523691899905");
    done();
})


test('can fetch events', async (done) => {


    let login = await loginUser('112328053981550743186', fetch);
    login = await login.json();
    const auth = login.auth;

    const scope = nock('https://www.googleapis.com', {allowUnmocked: true})
        .get(/calendar/)
        .reply(
            200,
            testReplies.calendarList
        )


    const results = await events(auth, {maxResults: 2});

    expect( results.etag ).toEqual("thisIsAFakePayload");
    expect( results.kind ).toEqual('calendar#events');
    expect( results.items.length ).toBe(2);
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

    expect(data.events[0].kind).toMatch(/.+/);
    expect(data.events[0].etag).toMatch(/.+/);
    expect(data.events[0].summary).toMatch(/.+/);
    expect(data.events[0].timeZone).toMatch(/.+/);
    expect(data.events[0].start).toMatch(/.+/);
    expect(data.events[0].end).toMatch(/.+/);

    done();
})
