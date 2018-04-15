import datastore from './datastore';
import {oauth2Client, url} from './oauth';
const {google} = require('googleapis'); 
import {findToken} from './user'; 
const express = require('express')
const session = require('express-session')
var FileStore = require('session-file-store')(session);
const app = express();


//const { buildSchema } = require('graphql');
import {graphqlExpress } from 'apollo-server-express';

import {schema} from './schema';

import bodyParser from 'body-parser';


app.use( bodyParser.json() );

app.use(session({
    store: new FileStore({}),
    secret: 'bubkis'
})); 


app.use(
    '/graphql',
    bodyParser.json(),
    graphqlExpress(request => ({
      schema: schema,
      context: request.session
    }))
);



//app.use('/graphql', graphqlHTTP({
  //schema: mySchema,
  //rootValue: root,
  //graphiql: true
//}));



app.get('/oauth2callback', function(req,res) {
	console.log(req.query);
    const code = req.query.code;

    findToken(null, code).then( auth => {
        req.session.auth = auth;
        res.json(auth);
    });
})

app.get('/session', (req,res) => {
    res.json(req.session);
})

app.post('/session', (req,res) => {
    //console.log(req);
    req.session.auth = Object.assign({}, req.session.auth, req.body.auth)
    res.json(req.session);
})

app.get('/events', async function(req,res) {
    const client = await oauth2Client(req.session.auth.token);
    //const auth = getOauth2Client().setCredentials(req.session.auth);
    const calendar = google.calendar({version: 'v3', auth: client});
    calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
    }, (err, data) => {
        if (err) return console.log('The API returned an error: ' + err);
        const events = data.items;
        console.log(data.data);
        console.log(Object.keys(data));
        res.json(data.data);
    });

})


app.get('/login', async function (req, res) {
    res.redirect(await url())
})


app.get('/list', function(req,res) {

    const query = datastore.createQuery('Task');
    datastore.runQuery(query).then(results => {
        console.log(results)
        res.json(results[0])
    }) 
}) 

export default app;
