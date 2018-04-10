import {readSecret, oauth2Client} from './oauth';
import {findToken, getAndSaveAuthFromCode, clientForUser} from './user';
const {google} = require('googleapis');
const nock = require('nock');
import datastore from './datastore';


test('findToken returns a token object', (done)=> {
    findToken('112328053981550743186').then(
        (token)=> {
            expect( Object.keys(token)).toEqual(['id', 'token'])
            expect( token.token.access_token ).toMatch(/.+/)
            expect( token.token.refresh_token).toMatch(/.+/)
            done();
        }
    )
}) 

test('getAndSaveAuthFromCode creates an auth if supplied a code', (done)=> { 

    const scope = nock('https://www.googleapis.com/oauth2/v4/token')
        .persist()
        .post('')
        .reply(
            200,
            {access_token: 'abc', refresh_token: '123', expires_in: 10}); 

    const scope_two = nock("https://www.googleapis.com/plus/v1/people/me")
        .get('')
        .reply(
            200,
            {id: 'notreal'}); 

    getAndSaveAuthFromCode(null, 'doesnt matter').then(
        (token)=> {
            expect( Object.keys(token)).toEqual(['id', 'token'])
            expect( token.token.access_token ).toMatch(/.+/)
            expect( token.token.refresh_token).toMatch(/.+/)
            scope.persist(false);
            done();
        }
    ) 
}) 



test('findToken returns throws if called for an unknown user without a token', (done)=> {
    findToken('112328053981550743186 9')
        .catch( err => {
            done();
        })

})

test('async client behavior', (done)=> {
    oauth2Client().then( client => {
        expect(typeof client).toEqual('object');
        done();
    })
})

test('async client gets a token for a valid user', (done)=> {
    findToken('112328053981550743186')
        .then( data => {
            return oauth2Client(data.token);
        })
        .then( client => {
            expect( client.credentials.access_token ).toMatch(/.+/);
            expect( client.credentials.refresh_token).toMatch(/.+/);
            done();
        })
})

test('clientForUser returns an authenticated client', (done)=> {
    const scope = nock("http://www.whocares.nothing/");
    clientForUser('112328053981550743186').then( client => {
        expect( client.credentials.access_token ).toMatch(/.+/);
        expect( client.credentials.refresh_token).toMatch(/.+/);
        done();
    })
})


test("clientForUser should work with an auth", (done)=> {
    const auth = {
        id: "foo",
        token: {
            access_token: '123',
            refresh_token: '456',
            expiry_date: 1523243158303
            }
    };
    clientForUser(auth).then( client => {
        expect( client.credentials.access_token ).toEqual('123')
        expect( client.credentials.refresh_token).toEqual('456')
        done();
    });
})
