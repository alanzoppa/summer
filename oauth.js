const {google} = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const fs = require('fs');



export const readSecret = () => {
    return new Promise( (resolve, reject) => {
        fs.readFile('client_secret.json', (err, content) => {
            if (err) reject(err);
            resolve(JSON.parse(content).web);
        })
    })
}



export const getOauth2Client = (credentials) => {
    const {client_secret, client_id, redirect_uris} = credentials;
    return new OAuth2(client_id, client_secret);
}

export async function oauth2Client(token) {
    const secret = await readSecret();
    const client = getOauth2Client(secret);
    if (token != undefined) {
        client.setCredentials(token);
    }
    return client
}

export async function url() {
    const client = await oauth2Client();
    return client.generateAuthUrl({
        access_type: 'offline',
        scope: [
            'https://www.googleapis.com/auth/plus.me',
            'https://www.googleapis.com/auth/calendar.readonly'
        ],
        prompt: 'consent',
    })
}
