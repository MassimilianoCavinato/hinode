module.exports = function (req, res){

    let atlas = require('../../db/atlas').atlas
    let mongodb = require('../../db/atlas').mongodb
    let _id = new mongodb.ObjectId(req.body._id)
    let fields = {
        type: req.body.type,
        vendor: req.body.vendor,
        name: req.body.name,
        image: req.body.image,
        tags: req.body.tags
    }
    console.log('EDITING NODE TEMPLATE', _id)
    atlas.then(function(client){
        console.log('Client done')
        client.db('test').collection('nodetemplates').updateOne({_id: _id}, {$set: fields}, function(error, result){
            console.log('Query done')

            if(error){
                console.log(error)
                res.send({
                    ok: false,
                    error: error
                })
            }
            else if(result === null){
                console.log("Node template id "+req.body._id+" couldn't be updated.")
                res.send({
                    ok: false,
                    error: "Node template id "+req.body._id+" couldn't be updated."
                })
            }
            else{
                console.log("Node template id "+req.body._id+" updated succesfully.")
                res.send({
                    ok: true,
                    data: "Node template id "+req.body._id+" couldn't be updated succesfully."
                })
            }
        })
    })
}
