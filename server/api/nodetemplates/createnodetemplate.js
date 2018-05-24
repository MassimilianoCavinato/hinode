module.exports = function (req, res){

    let request = require('request')
    let fs = require('fs')
    let uuidv1 = require('uuid/v1')
    let atlas = require('../../db/atlas').atlas
    let template = req.body

    atlas.then(function(client){
        client.db('test').collection('nodetemplates').insertOne(template, function(error, result){
            if(error){

                res.send({
                    ok: false,
                    data: "The node template couldn't be created."
                })
            }
            else if(result === null){

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
