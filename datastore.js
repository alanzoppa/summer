const Datastore = require('@google-cloud/datastore');

export default Datastore({keyFilename: './datastore_key.json'});
