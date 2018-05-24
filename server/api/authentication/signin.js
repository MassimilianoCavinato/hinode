module.exports = function (req, res){

    let atlas = require('../../db/atlas').atlas
    let bcrypt = require('bcryptjs')
    let email = req.body.email
    let password = req.body.password

    atlas.then(function(client){

        client.db('test').collection('users').findOne({email: email}, function(error, result){

            if(error){
                res.send(error)
            }
            else if(result == null){
                res.send({
                    ok: false,
                    response: {
                        user: null,
                        error:{
                            signin: ['Invalid Email / Password'],
                            signup: []
                        }
                    }
                })
            }
            else{
                bcrypt.compare(password, result.password)
                .then(function(valid) {
                    if(valid){
                        res.send({
                            ok: true,
                            response: {
                                user: {
                                    _id: result._id,
                                    username: result.username,
                                    email: result.email,
                                    session_token: result.session_token
                                },
                                error:{
                                    signin: [],
                                    signup: []
                                }
                            }
                        })
                    }else{
                        res.send({
                            ok: false,
                            response: {
                                user: null,
                                error:{
                                    signin: ['Invalid Email / Password'],
                                    signup: []
                                }
                            }
                        })
                    }
                })
            }
        })
    })
    .catch(function(error){
        console.log(error)
    })
}
