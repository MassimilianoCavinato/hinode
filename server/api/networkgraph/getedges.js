module.exports = function (req, res){

    let atlas = require('../../db/atlas').atlas
    console.log('GETTING EDGES')
    atlas.then(function(client){

        client.db('test').collection('edges').find({}).toArray(function(error, result){

            if(error || result == null){
                res.send({
                    ok: false,
                })
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
