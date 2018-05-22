module.exports = function (req, res){
    var atlas = require('/home/hinode/server/db/atlas')
    let name = req.body.name
    let ip = req.body.ip
    console.log('Creating Device')
    atlas.then(function(client){

        client.db('test').collection('devices').insertOne({name: name, ip: ip}, function(error, result){

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
