import httpRequest from 'request-promise-native';
import {findToken} from './user';



export async function overrideSession(obj) {
    const options = {
      uri: 'http://localhost:8080/session',
      method: 'POST',
      json: obj,
    };

    return await httpRequest(options); 
}


export async function loginUser(id)  {
    const token = await findToken(id);
    return await overrideSession({auth: token});
}
