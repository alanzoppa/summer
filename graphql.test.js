import { request } from 'graphql-request'


//test('thing', (done => {
    //var { graphql, buildSchema } = require('graphql');

    //request('http://localhost:8080/graphql', '{ hello }').then(data => console.log(data))
    //done();

//}))



test('thing', (async (done) => {
    const { graphql, buildSchema } = require('graphql');

    const data = await request(
        'http://localhost:8080/graphql',
        `{
            user(id: "123")  {
                id
                token {
                    access_token
                    refresh_token
                    expiry_date
                }
            }
        }`
    )
    console.log(data);
    expect(data.user.id).toMatch(/\d+/)
    expect(data.user.token.access_token).toMatch(/.+/)
    done();

}))

//{
                //token {
                    //access_token
                    //refresh_token
                    //expiry_date
                //}
            //}
