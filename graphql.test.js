import { request } from 'graphql-request';
import httpRequest from 'request-promise-native';
import {findToken, formatAuth} from './user';
import {loginUser} from './testhelpers';
import {overrideSession} from './testhelpers';
global['fetch'] = require('fetch-cookie/node-fetch')(require('node-fetch'));




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

    //await overrideSession({auth}, {}, fetch);

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
