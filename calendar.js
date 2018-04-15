import {clientForUser} from './user';
const {google} = require('googleapis');



export async function events(auth, params) {

    auth = await clientForUser(auth);

    params = Object.assign(
        {},
        {
            calendarId: 'primary',
            timeMin: (new Date()).toISOString(),
            maxResults: 100,
            singleEvents: true,
            orderBy: 'startTime',
        },
        params
    )

    return new Promise( (resolve, reject) => {
        const calendar = google.calendar({version: 'v3', auth});
        calendar.events.list(
            params,
            (err, data) => {
            if (err) reject(err);
            resolve(data.data);
        });
    })

}
