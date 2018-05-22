module.exports = function (req, res){
    var atlas = require('/home/hinode/server/db/atlas')

    atlas.then(function(client){

        client.db('test').collection('devices').find().toArray(function(error, result){
            console.log(result)
            if(error || result == null){
                res.send({
                    ok: false,
                    response: []
                })
            }
            else{
                res.send({
                    ok: true,
                    response: result
                })
            }
        })
    })
}
