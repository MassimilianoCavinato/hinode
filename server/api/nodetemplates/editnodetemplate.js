module.exports = function (req, res){
    let request = require('request')
    let fs = require('fs')
    let uuidv1 = require('uuid/v1')
    let atlas = require('../../db/atlas').atlas
    let mongodb = require('../../db/atlas').mongodb
    let _id = new mongodb.ObjectId(req.body._id)
    let fields = {
        type: req.body.type,
        vendor: req.body.vendor,
        name: req.body.name,
        image: req.body.image,
        tags: req.body.tags
    }
    let image_url = req.body.image
    let final_image_url
    let temp_image_name = 'node__'+uuidv1()+'.png'
    let upload_valid_pattern = req.protocol + '://' + req.get('host')+'/img/'
    //check if url resembles pattern for local host path or it a url pasted in from the internet
    function doesImageExist(image_url){

        if(image_url.startsWith(upload_valid_pattern+'node__')){
            let image_file_name = image_url.substring(image_url.lastIndexOf('/')+1)
            return fs.existsSync('img/'+image_file_name)
        }
        else{
            return false
        }
    }

    if(!doesImageExist(image_url)){
        fields.image = upload_valid_pattern+temp_image_name
        console.log("SAVING NEW IMAGE")
        request({ url: image_url, encoding: null }, function(error, response, body) {
            fs.writeFile('img/'+temp_image_name , body, { encoding : null }, function(err) {
                if(err){
                    console.log(err)
                }
            })
        })
    }
    console.log('EDITING NODE TEMPLATE', _id)
    atlas.then(function(client){
        console.log('Client done')
        client.db('test').collection('nodetemplates').updateOne({_id: _id}, {$set: fields}, function(error, result){
            console.log('Query done')

            if(error){
                console.log(error)
                res.send({
                    ok: false,
                    error: error
                })
            }
            else if(result === null){
                console.log("Node template id "+req.body._id+" couldn't be updated.")
                res.send({
                    ok: false,
                    error: "Node template id "+req.body._id+" couldn't be updated."
                })
            }
            else{
                console.log("Node template id "+req.body._id+" updated succesfully.")
                res.send({
                    ok: true,
                    data: "Node template id "+req.body._id+" couldn't be updated succesfully."
                })
            }
        })
    })
}

// let request = require('request')
// let fs = require('fs')
// let url = "https://www.mozilla.org/media/img/logos/firefox/logo-quantum-high-res.cfd87a8f62ae.png"
//
// request({ url: url, encoding: null }, function(error, response, body) {
//     console.log(body instanceof Buffer);
//     fs.writeFile('img/firefox.png', body, {
//         encoding : null
//     }, function(err) {
//         if (err)
//             res.send(err);
//         res.send('saved')
//     });
// });
