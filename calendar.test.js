import {findToken, getAndSaveAuthFromCode, clientForUser} from './user';
import {events} from './calendar';
const {google} = require('googleapis');

test('list events', async function(done) {
    const ev = await events('112328053981550743186', {maxResults: 1});
    //expect(ev.)
    console.log(ev.kind);
    done();
})
