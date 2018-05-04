module.exports = function (req, res){
    let request = require('request')
    let fs = require('fs')
    let url = "https://www.mozilla.org/media/img/logos/firefox/logo-quantum-high-res.cfd87a8f62ae.png"
    let uuidv1 = require('uuid/v1')
    request({ url: url, encoding: null }, function(error, response, body) {
        console.log(body instanceof Buffer);
        let file_path = 'img/node__'+uuidv1()+'.png'
        fs.writeFile(file_path, body, {
            encoding : null
        }, function(err) {
            if (err)
                res.send(err);
            res.send('saved')
        });
    });
}
