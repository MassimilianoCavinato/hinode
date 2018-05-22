module.exports = function (req, res){
    var atlas = require('../../db/atlas')
    var request = require('request')
    var https = require('https')
    var uuidv1 = require('uuid/v1')

    agent = new https.Agent({
        rejectUnauthorized: false
    });

    var device_id = '24207'
    var group_id = '24210'
    request({
        url: "https://172.30.183.221/api/table.json?id="+group_id+"&content=devices&columns=objid,group,host,name&count=99999&username=API&passhash=3317184866",
        method: 'GET',
        agent: agent
    }, function (err, resp, body) {
        console.log(body)
        let nodes = JSON.parse(body).devices
        .map(function(device){
            return {
                id: device.objid.toString(),
                label: device.name,
                type: 'Managed Radio',
                ip: device.host
            }
        })

        let edges = JSON.parse(body).devices
        .map(function(device){
            return {
                id: uuidv1(),
                from: device_id,
                to: device.objid.toString(),
                label: '',
                type: 'wireless'
            }
        })

        console.log(nodes)

        atlas.then(function(client){
            client.db('test').collection('nodes').insertMany(nodes)
            client.db('test').collection('edges').insertMany(edges)
            res.send({
                nodes: nodes,
                edges: edges
            })
        })


    })
}
