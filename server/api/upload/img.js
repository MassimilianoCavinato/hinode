module.exports = function (req, res){

    let request = require('request')
    let fs = require('fs')
    let uuidv1 = require('uuid/v1')
    let img_name = "node__"+uuidv1()+".png"

    fs.writeFile("img/"+img_name, req.file.buffer, function(err) {
        if(err) {
            res.send({
                ok: false,
                error: err
            })
        }
        else{
            res.send({
                ok: true,
                data: img_name
            });
        }

    });
}
