import {loginUser} from './testhelpers';
import httpRequest from 'request-promise-native';


test('loginUser', async (done) => {
    const session = await loginUser('112328053981550743186');
    //console.log(session);

    expect(session.cookie).toBeInstanceOf(Object);
    expect(session.auth).toBeInstanceOf(Object);
    expect(session.auth.id).toMatch(/.+/);
    expect(session.auth.token.access_token).toMatch(/.+/);
    expect(session.auth.token.refresh_token).toMatch(/.+/);

    done();
})
