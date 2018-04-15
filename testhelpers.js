import {formatAuth, findToken} from './user';

export const fakeAuth = formatAuth(
    'fakeid',
    {
        access_token: '11111111',
        refresh_token: '22222222',
        expiry_date: 1523691899905
    }
)

export async function overrideSession(obj, headers, fetch) {
    headers = Object.assign(
        {},
        { 'Content-Type': 'application/json' },
        headers
    )
    const req = await fetch(
        'http://localhost:8080/session',
        {
            method: 'POST',
            body: JSON.stringify(obj),
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    )
    return req;
}


export async function loginUser(id, fetch)  {
    const token = await findToken(id);
    return await overrideSession({auth: token}, {}, fetch);
}
