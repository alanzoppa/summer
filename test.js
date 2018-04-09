import {getOauth2Client, readSecret, oauth2Client} from './oauth';
import {getOrUpdateUser, findToken, getAndSaveAuthFromCode} from './user';
const {google} = require('googleapis');
const nock = require('nock');
import datastore from './datastore';


test('get or create user', (done) => {
    getOrUpdateUser("test-123", {things: 'stuff'})
        .then(function(result) {
            expect(result.auth.things).toEqual('stuff');
            expect(result.user_id).toEqual('test-123');
            done();
        })
})


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

//test('read secret', (done)=> {

    //function listEvents(auth, cb) {
        //const calendar = google.calendar({version: 'v3', auth});
        //calendar.events.list({
            //calendarId: 'primary',
            //timeMin: (new Date()).toISOString(),
            //maxResults: 10,
            //singleEvents: true,
            //orderBy: 'startTime',
        //}, (err, {data}) => {
            //if (err) return console.log('The API returned an error: ' + err);
            //console.log(data);
        //});
        //cb();
    //} 


    //readSecret()
        //.then(
        //(secret)=> {
            //console.log(secret);
            //const oAuth2Client = getOauth2Client(secret);
            //oAuth2Client.setCredentials(
                //{
                    //access_token: "ya29.GluXBdtiibLvNzinD_TFtchN6Lohn1yRRvaTl0JmBZ5BNuit6WavuQ3QCIaYEr96qs2iJEadRQ2nzxcbErN6VM3-LQSjR6hZK4nuQwMtN9pTThuY5NVJk70285Qg",
                    //refresh_token: "1/bkcllZXRXAS3Te-s1e7o2GNzawF8js_-CMbuykBHT3g"
                //}
            //);
            //listEvents(oAuth2Client, done);
        //}
    //)

//})
