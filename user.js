import datastore from './datastore';
import {getOauth2Client, oauth2Client} from './oauth';
const {google} = require('googleapis');
const plus = google.plus('v1');

const key = (key) => {
    return datastore.key(['GoogleUser', key]);
}

const upsertUser = (auth) => {
    return datastore.upsert({key: key(auth.id), data: auth.token})
}

const formatAuth = (user_id, auth) => {
    return {
        id: user_id,
        token: {
            access_token: auth.access_token,
            refresh_token: auth.refresh_token,
            expiry_date: auth.expiry_date
        }
    }
}

export const getUser = (user_id) => { 
    return new Promise( (resolve, reject) => {
        datastore.get(key(user_id)).then( data => {
            resolve( {auth: data[0], user_id}) ;
        }).catch(reject)
    })
}

function getUserId(client) {
    return new Promise( (resolve, reject) => {
        plus.people.get({
            userId: 'me',
            auth: client
        }, function (err, response) {
            if (err) { reject(err) }
            resolve(response.data.id);
        });
    })
}




export async function getAndSaveAuthFromCode(user_id, code) {
    const client = await oauth2Client();
    const tokenResponse = await client.getToken(code);
 
    if (user_id == null) {
        client.setCredentials(tokenResponse.tokens);
        user_id = await getUserId(client);
    }
    return formatAuth(user_id, tokenResponse.tokens);
}


export async function findToken(user_id, code) {
    if (user_id == null && code != undefined) {
        const auth = await getAndSaveAuthFromCode(null, code);
        await upsertUser(auth);
        user_id = auth.id
    }
    const result = await datastore.get(key(user_id))
    if (result[0] == undefined) { throw "User: "+user_id+" is not in the datastore"; }
    return formatAuth(user_id, result[0]);
}

// accepts either a user id or auth object
export async function clientForUser(auth) {
    if (typeof auth != "object") {
        auth = await findToken(auth);
    }
    return oauth2Client(auth.token);
}
