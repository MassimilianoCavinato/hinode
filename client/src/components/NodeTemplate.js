import React from 'react'
import axios from 'axios'
import {SERVER_URL} from '../config/config.js'
import NodeTemplateRow from './NodeTemplateRow'
import NewNodeTemplateForm from './NewNodeTemplateForm'
import EditNodeTemplateForm from './EditNodeTemplateForm'
import '../css/nodetemplates.css'
import '../css/tags.css'

class NodeTemplate extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            mode: 'read',
            template: {},
            node_templates : []
        }
    }

    componentWillMount(){
        this.getTemplates()
    }

    getTemplates(){
        axios.get(SERVER_URL+'/api/nodetemplates/getnodetemplates')
        .then((response) => {
            this.setState({node_templates: response.data})
        })
        .catch((error) => {
            console.log(error)
        })
    }

    switchToReadMode(){
        this.setState({
            mode: 'read',
            template: {}
        })
    }

    switchToInsertMode(){
        this.setState({
            mode: 'insert',
            template: {}
        })
    }

    switchToEditMode(template){
        this.setState({
            mode: 'edit',
            template: template
        })
    }

    deleteTemplate(_id){
        if(window.confirm('Do you really want to delete this template?\n\nTemplate Id: '+_id)){
            axios.delete(SERVER_URL+'/api/nodetemplates/deletenodetemplate',  {params: {_id: _id}})
            .then((response) => {
                if(response.data.ok){
                    this.getTemplates()
                }
            })
            .catch((error) => {
                console.log(error)
            })
        }
    }

    handleMode(){
        switch(this.state.mode){
            case "insert":
                return <NewNodeTemplateForm switchToReadMode={this.switchToReadMode.bind(this)} getTemplates={this.getTemplates.bind(this)} />
            case "edit":
                return <EditNodeTemplateForm template={this.state.template} switchToReadMode={this.switchToReadMode.bind(this)}  getTemplates={this.getTemplates.bind(this)} />
            default:
                return (
                    <div>
                        <div style={{position: 'relative'}}>
                            <h1>Device Templates </h1>
                            <button onClick={()=>{this.switchToInsertMode({})}} className='btn btn-success btn-success' style={{position: 'absolute', top: 0, right: 0}}><span className='glyphicon glyphicon-plus' > NEW TEMPLATE</span></button>
                        </div>
                        <table className='header-fixed table table-bordered '>
                            <thead>
                                <tr>
                                    <th className='col-xs-2'>TYPE</th>
                                    <th className='col-xs-2'>VENDOR</th>
                                    <th className='col-xs-4'>NAME</th>
                                    <th className='col-xs-2'>IMAGE</th>
                                    <th className='col-xs-1'>EDIT</th>
                                    <th className='col-xs-1'>DELETE</th>
                                </tr>
                            </thead>
                            <tbody className='header-fixed-scrollbar'>
                                { this.state.node_templates.map((template) => <NodeTemplateRow key={template._id} template={template} switchToEditMode={this.switchToEditMode.bind(this, template)} deleteTemplate={this.deleteTemplate.bind(this, template._id)} /> )}
                            </tbody>
                        </table>
                    </div>
                )
        }
    }

    render(){
        return(
            <div className='container-fluid'>
                {this.handleMode()}
            </div>
        )
    }
}

export default NodeTemplate
