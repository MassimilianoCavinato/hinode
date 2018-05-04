module.exports = function (req, res){

    let atlas = require('../../db/atlas').atlas

    atlas.then(function(client){

        client.db('test').collection('nodetemplates').find({}).sort({vendor: 1, type: 1, name: 1}).toArray(function(error, result){
            if(error || result == null){
                res.send([])
            }
            else{
                res.send(result)
            }
        })
    })
}
