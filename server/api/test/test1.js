module.exports = function (req, res){
    // let atlas = require('../../db/atlas').atlas
    // console.log('GETTING NODES')
    // atlas.then(function(client){
    //     client.db('test').collection('nodes_bkp').find({}).toArray(function(error, result){
    //
    //         for(let i = 0; i< result.length; i++){
    //
    //
    //             client.db('test').collection('nodes_bkp').update({"id": result[i].id}, {
    //                 $set: {"image" : result[i].image.slice(26)}
    //             })
    //         }
    //
    //         res.send("done");
    //
    //         let updated =  result.map(function(node){
    //             return {
    //                 id: node.id,
    //                 image: node.image
    //             }
    //         })
    //         res.send(updated);
    //     })
    // })
}
