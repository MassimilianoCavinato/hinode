module.exports = function (req, res){

    let atlas = require('../../db/atlas').atlas

    let edge = req.body

    let style = {
        color:{
            color: undefined
        },
        dashes: undefined
    }

    switch(edge.type){
        case 'Wireless':
            Object.assign(edge, {
                color:{
                    color: '#2e86c1'
                },
                dashes: true
            })
            break;
        case 'Copper':
            Object.assign(edge, {
                color:{
                    color: '#943126'
                },
            })
            break;
        case 'Fiber':
            Object.assign(edge, {
                color:{
                    color: '#273746'
                },
            })
            break;
        default:

    }
    console.log('SAVING EDGE', edge.id)
    console.log(edge)

    atlas.then(function(client){

        client.db('test').collection('edges').update({id: edge.id}, edge, {upsert: true}, function(error, result){
            if(error || result == null){
                res.send({
                    ok: false,
                })
            }
            else{
                res.send({
                    ok: true,
                    id: edge.id
                })
            }
        })
    })
}
