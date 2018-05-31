const dotenv = require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')
const util = require('util')
const multer = require('multer')()

//SERVER
const server = express()
server.use(cors())
server.use(bodyParser.urlencoded({extended: true}))
server.use(bodyParser.json())
server.use('/img', express.static(__dirname+'/img/'))
server.use('/icon', express.static(__dirname+'/icon/'))
server.listen(3001, function(){
    console.log("Node server listening", )
})

///////////////////////////////////////////////////////////////////
//>>>>>>>>>>>>>>>>>>>>>>    ROUTES    <<<<<<<<<<<<<<<<<<<<<<<<<<<//
///////////////////////////////////////////////////////////////////

//AUTHENTICATION
server.post('/api/authentication/signin', function(req, res){ require('./api/authentication/signin')(req, res) } )
server.post('/api/authentication/signup', function(req, res){ let signup = require('./api/authentication/signup')(req, res) })
server.post('/api/authentication/session_token', function(req, res){ let session_token = require('./api/authentication/session_token')(req, res) })

//NETWORK GRAPH NODES
server.get('/api/networkgraph/nodeselectors', function(req, res){ require('./api/networkgraph/nodeselectors')(req, res) })
server.get('/api/networkgraph/getnodes', function(req, res){ require('./api/networkgraph/getnodes')(req, res) })
server.get('/api/networkgraph/getnode', function(req, res){ require('./api/networkgraph/getnode')(req, res) })
server.post('/api/networkgraph/savenode', function(req, res){ require('./api/networkgraph/savenode')(req, res) })
server.put('/api/networkgraph/movenode', function(req, res){ require('./api/networkgraph/movenode')(req, res) })
server.delete('/api/networkgraph/deleteelements', function(req, res){ require('./api/networkgraph/deleteelements')(req, res) })

//NETWORK GRAPH EDGES
server.get('/api/networkgraph/getedges', function(req, res){ require('./api/networkgraph/getedges')(req, res) })
server.get('/api/networkgraph/getedge', function(req, res){ require('./api/networkgraph/getedge')(req, res) })
server.post('/api/networkgraph/saveedge', function(req, res){ require('./api/networkgraph/saveedge')(req, res) })

//NODE TEMPLATES
server.get('/api/nodetemplates/getnodetemplates', function(req, res){ require('./api/nodetemplates/getnodetemplates')(req, res) })
server.post('/api/nodetemplates/createnodetemplate', function(req, res){ require('./api/nodetemplates/createnodetemplate')(req, res) })
server.put('/api/nodetemplates/editnodetemplate', function(req, res){ require('./api/nodetemplates/editnodetemplate')(req, res) })
server.delete('/api/nodetemplates/deletenodetemplate', function(req, res){ require('./api/nodetemplates/deletenodetemplate')(req, res) })

//upload img
server.post('/api/upload/img', multer.single('file'), function(req, res){ require('./api/upload/img')(req, res) })

//TAGS
server.get('/api/tags/gettags', function(req, res){ require('./api/tags/gettags')(req, res) })


//TEST
server.get('/api/test/test1', function(req, res){ require('./api/test/test1')(req, res) })
