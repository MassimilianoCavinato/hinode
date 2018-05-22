const mongodb = require('mongodb')
const mongoclient = mongodb.MongoClient

var atlas = mongoclient.connect(process.env.MONGODB_CONN_STRING)

module.exports =  {
    mongodb,
    atlas
}
