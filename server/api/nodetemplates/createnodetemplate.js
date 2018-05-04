module.exports = function (req, res){

    let atlas = require('../../db/atlas').atlas
    let template = req.body
    console.log('CREATING NEW NODE TEMPLATE')
    
    atlas.then(function(client){
        client.db('test').collection('nodetemplates').insertOne(template, function(error, result){
            if(error){
                console.log(error)
                res.send({
                    ok: false,
                    data: "The node template could't be created."
                })
            }
            else if(result === null){
                console.log("The node template could't be created.")
                res.send({
                    ok: false,
                    data: "The node template could't be created."
                })
            }
            else{
                console.log("New node template created succesfully.")
                res.send({
                    ok: true,
                    data: "New node template created succesfully."
                })
            }
        })
    })
}
