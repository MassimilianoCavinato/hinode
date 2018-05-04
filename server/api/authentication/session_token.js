module.exports = function (req, res){

    let atlas = require('../../db/atlas').atlas
    let mongodb = require('../../db/atlas').mongodb
    let bcrypt = require('bcryptjs')
    let _id = req.body._id
    let session_token = req.body.session_token

    atlas.then(function(client){

        client.db('test').collection('users').findOne({_id:new mongodb.ObjectID(_id), session_token: session_token}, function(error, result){

            if(error){
                res.send(error)
            }
            if(result == null){
                res.send(false)
            }
            else{
                res.send(true)
            }
        })
    })
}
