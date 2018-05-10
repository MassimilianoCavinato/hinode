module.exports =  function (req, res){

    let atlas = require('../../db/atlas').atlas
    let bcrypt = require('bcryptjs')
    let username = req.body.username
    let email = req.body.email
    let password = req.body.password
    let password_confirm = req.body.password_confirm
    let password_hash = bcrypt.hashSync(req.body.password, 3);
    let session_token = bcrypt.hashSync(req.body.email+req.body.password, 3)


    errors = []

    if(password !== password_confirm){ errors.push("The passwords don't match.")}
    if(password.length < 6){ errors.push("The password can't be shorter than 6 characters.")}
    if(username.length < 4){ errors.push("The username can't be shorter than 4 characters")}

    if(errors.length == 0){

        atlas.then(function(client){
            client.db('test').collection('users').insertOne({
            username: username,
            email: email,
            password: password_hash,
            session_token: session_token,
            date_registered: new Date()}, function(error, result){

                if(error){
                    res.send({
                        ok: false,
                        response: {
                            user: null,
                            error:{
                                signin: [],
                                signup: ["This email is already in use."]
                            }
                        }

                    })
                }else{
                    console.log("A new user signed up!")
                    res.send({
                        ok: true,
                        response: {
                            user: {
                                _id: result.insertedId,
                                session_token: session_token,
                                username: username,
                                email: email
                            },
                            error:{
                                signin: [],
                                signup: []
                            }
                        }
                    })
                }
            })
        })
    }
    else{
        res.send({
            ok: false,
            response: {
                user: null,
                error:{
                    signin: [],
                    signup: errors
                }
            }

        })
    }
}
