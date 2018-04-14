import { request } from 'graphql-request';
import httpRequest from 'request-promise-native';
import {findToken, formatAuth} from './user';
import {loginUser} from './testhelpers';
import {overrideSession} from './testhelpers';


//test('thing', (done => {
    //var { graphql, buildSchema } = require('graphql');

    //request('http://localhost:8080/graphql', '{ hello }').then(data => console.log(data))
    //done();

//}))


//test('stuff', async (done) => {


    //await loginUser('112328053981550743186');

//})

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

test('empty sessions query the datastore for users', (async (done) => {
    //console.log(q('112328053981550743186'));
    const data = await request(
        'http://localhost:8080/graphql',
        q('112328053981550743186')
    )
    //console.log(data);
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

    console.log(auth);

    const session = await overrideSession( { auth } )

    console.log(session)

    const data = await request(
        'http://localhost:8080/graphql',
        q('me')
    )
    console.log(data);
    expect(data.user.id).toMatch(/\d+/)
    expect(data.user.token.access_token).toMatch(/.+/)
    done();
})
