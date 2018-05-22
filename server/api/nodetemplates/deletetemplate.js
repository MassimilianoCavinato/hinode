module.exports = function (req, res){

    var atlas = require('../../db/atlas')

    let _id = req.query._id

    atlas.then(function(client){

        client.db('test').collection('nodetemplates').deleteOne({_id: _id}, function(error, result){
            if(error){
                res.send({
                    ok: false,
                    error: error
                })
            }
            else if(result === null)
                res.send({
                    ok: false,
                    error: "Template "+_id+" couldn't be deleted."
                })
            }
            else{
                res.send({
                    ok: true,
                    data: "Template "+_id+" deleted succesfully."
                })
            }
        })
    })
}
