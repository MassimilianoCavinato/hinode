module.exports = function (req, res){

    let atlas = require('../../db/atlas').atlas
    let nodes = req.query.nodes
    let edges = req.query.edges

    atlas.then(function(client){

        if(edges != undefined){
            client.db('test').collection('edges').deleteMany({id: {$in: edges}})
        }
        else{
            console.log('NO EDGES TO DELETE')
        }

        if(nodes != undefined){
            client.db('test').collection('nodes').deleteMany({id: {$in: nodes}})
        }
        else{
            console.log('NO NODES TO DELETE')
        }

        res.send(true)
    })
}
