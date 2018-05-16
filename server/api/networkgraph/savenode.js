module.exports = function (req, res){

    let atlas = require('../../db/atlas').atlas
    let node = req.body
    if(node.category === "Device"){
        node.label = node.vendor+' '+node.model+'\n'+node.name+'\n'+node.ip
    }
    else if(node.category === "Customer"){
        node.label = node.name
    }

    console.log('SAVING NODE', node.id)
    atlas.then(function(client){

        client.db('test').collection('nodes').update({id: node.id}, node, {upsert: true}, function(error, result){
            if(error || result == null){

                res.send({
                    ok: false,
                })
            }
            else{
                res.send({
                    ok: true,
                    id: node.id
                })
            }
        })
    })
}
