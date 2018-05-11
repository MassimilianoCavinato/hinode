module.exports = function (req, res){

    let request = require('request')
    let fs = require('fs')
    let uuidv1 = require('uuid/v1')
    let atlas = require('../../db/atlas').atlas
    let template = req.body


    console.log(template)
    let image_url = template.image
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
        template.image = upload_valid_pattern+temp_image_name
        console.log("SAVING NEW IMAGE")
        request({ url: image_url, encoding: null }, function(error, response, body) {
            fs.writeFile('img/'+temp_image_name , body, { encoding : null }, function(err) {
                if(err){
                  console.log(err)
                }
            })
        })
    }

    atlas.then(function(client){
        client.db('test').collection('nodetemplates').insertOne(template, function(error, result){
            if(error){
                console.log(error)
                res.send({
                    ok: false,
                    data: "The node template couldn't be created."
                })
            }
            else if(result === null){
                console.log("The node template couldn't be created.")
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
