import datastore from './datastore';
import {oauth2Client, url} from './oauth';
const {google} = require('googleapis');

import {findToken} from './user';


const express = require('express')
const session = require('express-session')
var FileStore = require('session-file-store')(session);
const app = express();

app.set('trust proxy', 1) // trust first proxy

app.use(session({
    store: new FileStore({}),
    secret: 'bubkis'
})); 

app.get('/oauth2callback', function(req,res) {
    const plus = google.plus('v1');
    const code = req.query.code;

    findToken(null, code).then( auth => {
        req.session.auth = auth;
        res.json(auth);
    });
})

app.get('/session', (req,res) => {
    res.json(req.session);
})

app.get('/events', function(req,res) {
    const auth = getOauth2Client().setCredentials(req.session.auth);
    const calendar = google.calendar({version: 'v3', auth});
    calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
    }, (err, data) => {
        if (err) return console.log('The API returned an error: ' + err);
        const events = data.items;
        console.log(data);
    });

})


app.get('/login', function (req, res) {
    url().then( url => {res.redirect(url)})
})

app.get('/list', function(req,res) {

    const query = datastore.createQuery('Task');
    datastore.runQuery(query).then(results => {
        console.log(results)
        res.json(results[0])
    }) 
}) 

app.listen(8080, () => console.log('Example app listening on port 8080!'))
