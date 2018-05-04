module.exports = function (req, res){

    let atlas = require('../../db/atlas').atlas
    let mongodb = require('../../db/atlas').mongodb
    let _id = new mongodb.ObjectID(req.query._id)
    console.log("DELETING NODE TEMPLATE" ,_id)
    atlas.then(function(client){

        client.db('test').collection('nodetemplates').deleteOne({_id: _id}, function(error, result){
            if(error){
                console.log(error)
                res.send({
                    ok: false,
                    error: error
                })

            }
            else if(result === null || result.deletedCount === 0){
                console.log("Template "+_id+" couldn't be deleted.")
                res.send({
                    ok: false,
                    error: "Template "+_id+" couldn't be deleted."
                })
            }
            else{
                console.log( "Template "+_id+" deleted succesfully.")
                res.send({
                    ok: true,
                    data: "Template "+_id+" deleted succesfully."
                })
            }
        })
    })
}
