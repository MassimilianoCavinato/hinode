import React from 'react'
import axios from 'axios'
import {SERVER_URL} from '../config/config.js'
import DeviceTemplateRow from './DeviceTemplateRow'
import CustomerTemplateRow from './CustomerTemplateRow'
import NewDeviceTemplateForm from './NewDeviceTemplateForm'
import EditDeviceTemplateForm from './EditDeviceTemplateForm'
import NewCustomerTemplateForm from './NewCustomerTemplateForm'
import EditCustomerTemplateForm from './EditCustomerTemplateForm'
import '../css/nodetemplates.css'
import '../css/tags.css'

class NodeTemplate extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            mode: 'read',
            group: '',
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

    switchToInsertDeviceMode(){
        this.setState({
            mode: 'insert device',
            group: 'device',
            template: {}
        })
    }

    switchToEditDeviceMode(template){
        this.setState({
            mode: 'edit device',
            template: template
        })
    }

    switchToInsertCustomerMode(){
        this.setState({
            mode: 'insert customer',
            template: {}
        })
    }

    switchToEditCustomerMode(template){
        this.setState({
            mode: 'edit customer',
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
            case "insert device":
                return <NewDeviceTemplateForm switchToReadMode={this.switchToReadMode.bind(this)} getTemplates={this.getTemplates.bind(this)} />
            case "edit device":
                return <EditDeviceTemplateForm template={this.state.template} switchToReadMode={this.switchToReadMode.bind(this)}  getTemplates={this.getTemplates.bind(this)} />
            case "insert customer":
                return <NewCustomerTemplateForm switchToReadMode={this.switchToReadMode.bind(this)} getTemplates={this.getTemplates.bind(this)} />
            case "edit customer":
                return <EditCustomerTemplateForm template={this.state.template} switchToReadMode={this.switchToReadMode.bind(this)}  getTemplates={this.getTemplates.bind(this)} />
            default:
                return (
                    <div>
                        <div style={{position: 'relative'}}>
                            <h1>Device Templates </h1>
                            <button onClick={()=>{this.switchToInsertDeviceMode({})}} className='btn btn-success btn-success' style={{position: 'absolute', top: 0, right: 0}}><span className='glyphicon glyphicon-plus' > New</span></button>
                        </div>
                        <table className='header-fixed table table-bordered '>
                            <thead>
                                <tr>
                                    <th className='col-xs-2'>TYPE</th>
                                    <th className='col-xs-2'>VENDOR</th>
                                    <th className='col-xs-4'>MODEL</th>
                                    <th className='col-xs-2'>IMAGE</th>
                                    <th className='col-xs-1'>EDIT</th>
                                    <th className='col-xs-1'>DELETE</th>
                                </tr>
                            </thead>
                            <tbody className='header-fixed-scrollbar'>
                                { this.state.node_templates.filter(template => template.group === "Device").map((template) => <DeviceTemplateRow key={template._id} template={template} switchToEditDeviceMode={this.switchToEditDeviceMode.bind(this, template)} deleteTemplate={this.deleteTemplate.bind(this, template._id)} /> )}
                            </tbody>
                        </table>

                        <div style={{position: 'relative'}}>
                            <h1>Customer Templates </h1>
                            <button onClick={()=>{this.switchToInsertCustomerMode({})}} className='btn btn-success btn-success' style={{position: 'absolute', top: 0, right: 0}}><span className='glyphicon glyphicon-plus' > New</span></button>
                        </div>
                        <table className='header-fixed table table-bordered '>
                            <thead>
                                <tr>
                                    <th className='col-xs-3'>TEMPLATE NAME</th>
                                    <th className='col-xs-3'>PROVIDER</th>
                                    <th className='col-xs-2'>PRIORITY</th>
                                    <th className='col-xs-2'>IMAGE</th>
                                    <th className='col-xs-1'>EDIT</th>
                                    <th className='col-xs-1'>DELETE</th>
                                </tr>
                            </thead>
                            <tbody className='header-fixed-scrollbar'>
                                { this.state.node_templates.filter(template => template.group === "Customer").map((template) => <CustomerTemplateRow key={template._id} template={template} switchToEditCustomerMode={this.switchToEditCustomerMode.bind(this, template)} deleteTemplate={this.deleteTemplate.bind(this, template._id)} /> )}
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
