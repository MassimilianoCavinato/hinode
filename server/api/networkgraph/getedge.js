module.exports = function (req, res){

    let atlas = require('../../db/atlas').atlas
    let id = req.query.id
    console.log('GETTING EDGE', id)
    atlas.then(function(client){

        client.db('test').collection('edges').findOne({id: id}, function(error, result){
            if(error || result == null){
                res.send({
                    ok: false,
                })
            }
            else{
                res.send({
                    ok: true,
                    edge: result
                })
            }
        })

    })
}
