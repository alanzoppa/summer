import {loginUser, fakeAuth, overrideSession} from './testhelpers';
import httpRequest from 'request-promise-native';
const fetch = require('fetch-cookie/node-fetch')(require('node-fetch'));


test('overrideSession', async (done) => {
    const req = await overrideSession({auth: fakeAuth}, {}, fetch)
    const session = await req.json();

    const tryAgain = await fetch('http://localhost:8080/session')
    const newSession = await tryAgain.json();

    expect(newSession.cookie).toBeInstanceOf(Object);
    expect(newSession.auth).toBeInstanceOf(Object);
    expect(newSession.auth.id).toMatch(/.+/);
    expect(newSession.auth.token.access_token).toMatch(/.+/);
    expect(newSession.auth.token.refresh_token).toMatch(/.+/);

    done();
})
