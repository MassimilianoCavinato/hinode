module.exports = function (req, res){

    let atlas = require('../../db/atlas').atlas
    let id = req.query.id
    console.log('GETTING NODE', id)
    atlas.then(function(client){

        client.db('test').collection('nodes').findOne({id: id}, function(error, result){
            console.log(result)
            if(error || result == null){
                res.send({
                    ok: false,
                })
            }
            else{
                res.send({
                    ok: true,
                    node: result
                })
            }
        })

    })
}
