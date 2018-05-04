module.exports = function (req, res){

    var atlas = require('../../db/atlas').atlas

    atlas.then(function(client){

        client.db('test').collection('tags').find({}).sort({text: 1}).toArray(function(error, result){
            if(error || result == null){
                res.send({ok: false})
            }
            else{
                res.send({
                    ok: true,
                    data: result
                })
            }
        })
    })
}
