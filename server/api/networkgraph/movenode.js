module.exports = function (req, res){

    let atlas = require('../../db/atlas').atlas

    let id = req.body.id
    let x = req.body.x
    let y = req.body.y

    console.log('MOVING NODE', id)
    atlas.then(function(client){

        client.db('test').collection('nodes').update(
        {id: id},
        {
            $set:{
                x: x,
                y: y,
            }
        },
        function(error, result){

            if(error || result == null){
                res.send({
                    ok: false,
                })
            }
            else{
                res.send({
                    ok: true,
                })
            }
        })
    })
}
