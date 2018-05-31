import React from 'react'
import axios from 'axios'
import IpField from './IpField'
import VlanField from './VlanField'
import { textifyPriority } from '../utils/utils.js'
import { WithContext as ReactTags } from 'react-tag-input'
import { SERVER_URL } from '../config/config'
import uuidv1 from 'uuid/v1'

class CustomerNodeModal extends React.Component{

    constructor(props){
        super(props)
        this.state =  {
           nodeTemplates: [],
           nodeTemplateFilterResults: [],
           nodeSearch: '',
           saveError: false,
           saving: false,
           name: this.props.node.name || '',
           ips: this.props.node.ips || [],
           vlans: this.props.node.vlans || [],
           provider: this.props.node.provider || '',
           priority: this.props.node.priority || 2,
           tags: this.props.node.tags || '',
           image: this.props.node.image || '',
           suggetions: []
        }
    }

    componentWillMount(){
        this.getNodeTemplates()
        this.getTags()
    }

    componentDidMount(){
        console.log(this.state)
    }

    getTags(){
        axios.get(SERVER_URL+'/api/tags/gettags')
        .then((response) => {
            if(response.data.ok){
                this.setState({
                    suggestions: response.data.data
                })
            }
        })
        .catch((error) => {
            console.log(error)
        })
    }

    getNodeTemplates(){
        axios.get(SERVER_URL+"/api/nodetemplates/getnodetemplates")
        .then((response) => {
            let nodeTemplates = response.data.filter(template => template.group === "Customer")
            this.setState({nodeTemplates: nodeTemplates})
        })
        .catch((error)=>{
            this.setState({nodeTemplates: []})
            console.log(error)
        })
    }

    setNodeTemplateFilterResults(e){

        let search_text = e.target.value.toLowerCase()
        let filteredNodeTemplates = []
        if(search_text.length > 0){
            filteredNodeTemplates = this.state.nodeTemplates.filter(nodeTemplate => nodeTemplate.template_name.toLowerCase().includes(search_text))
        }
        this.setState({
            nodeTemplateFilterResults: filteredNodeTemplates,
            nodeSearch: search_text,
        })
    }

    getNodeTemplateFilterResults(){

        let nodeTemplateFilterResults = this.state.nodeTemplateFilterResults.map(nodeTemplate => {
            return(
                <div key={nodeTemplate._id} style={{padding: "4px", border: '1px solid gray', borderRadius: '2px', marginBottom: '2px', backgroundColor: '#DDD', cursor: 'pointer', height: '50px'}} onClick={(e) => {this.selectNodeTemplate(e, nodeTemplate)}} >
                    <img src={SERVER_URL+'/img/'+nodeTemplate.image}  style={{height: '40px', width: '40px', float: 'right'}} alt='' />
                    <b>{nodeTemplate.template_name}</b>
                </div>
            )
        })
        return nodeTemplateFilterResults
    }

    selectNodeTemplate(e, nodeTemplate){
        this.setState({
            nodeTemplateFilterResults: [],
            nodeSearch: '',
            provider: nodeTemplate.provider,
            priority: nodeTemplate.priority,
            tags: nodeTemplate.tags,
            image: nodeTemplate.image,
        })

        console.log(nodeTemplate)

    }

    saveNode(e){
        e.preventDefault()
        this.setState({saving: true})
        let newNode = {
            id: e.target.id.value,
            x: e.target.x.value,
            y: e.target.y.value,
            category: "Customer",
            name: e.target.name.value,
            ips: this.state.ips,
            vlans: this.state.vlans,
            provider: e.target.provider.value,
            priority: e.target.priority.value,
            tags: this.state.tags,
            image: e.target.image.value
        }

        axios.post(SERVER_URL+'/api/networkgraph/savenode', newNode)
        .then((response) => {
            if(response.data.ok){
                this.props.closeModal()
                this.props.refreshNetwork()
            }else{
                this.setState({saveError: true})
            }
        })
        .catch((error) => {
            console.log(error)
            this.setState({saveError: true})
        })
    }

    handleDelete(i) {
        let tags = this.state.tags
        tags.splice(i, 1)
        this.setState({tags: tags})
    }

    handleAddition(tag) {
        tag.id = tag.id.toLowerCase().replace(/[^a-z0-9]/gi,'')
        tag.text = tag.text.toLowerCase().replace(/[^a-z0-9]/gi,'')

        if(!this.state.tags.includes(tag)){
            let tags = this.state.tags
            tags.push(tag)
            this.setState({tags: tags})
        }
        else{
            alert("Tag "+tag.text+" already exists")
        }
    }

    showIpFields() {

        return(
            this.state.ips.map((ip) => {
                return <IpField key={ip.id} data={ip}  isList={true} removeIpField={this.removeIpField.bind(this)} updateIp={this.updateIp.bind(this)} />
            })
        )
    }

    updateIp(id, ip_value) {

        let ips = this.state.ips
        ips.map((ip) => {
            if(ip.id === id){
                ip.ip = ip_value
            }
            return ip
        })
        this.setState({ips: ips})
    }

    addIpField(e) {
        e.preventDefault()
        let ips = this.state.ips
        ips.push({id: uuidv1(), ip: ''})
        this.setState({ips: ips})

    }

    removeIpField(id) {

        let ips = this.state.ips.filter(ip => ip.id !== id)
        this.setState({ips: ips})
    }

    showVlanFields(e) {
        return(
            this.state.vlans.map((vlan) => {
                return <VlanField key={vlan.id} data={vlan} isList={true} removeVlanField={this.removeVlanField.bind(this)} updateVlan={this.updateVlan.bind(this)}/>
            })
        )
    }

    updateVlan(id, vlan_value) {

        let vlans = this.state.vlans
        vlans.map((vlan) => {
            if(vlan.id === id){
                vlan.vlan = vlan_value
            }
            return vlan
        })
        this.setState({vlans: vlans})
    }

    addVlanField(e) {
        e.preventDefault()
        let vlans = this.state.vlans
        vlans.push({id: uuidv1(), vlan: ''})
        this.setState({vlans: vlans})
    }

    removeVlanField(id) {
        let vlans = this.state.vlans.filter(vlan => vlan.id !== id)
        this.setState({vlans: vlans})
    }

    render(){
        return(
            <div id='node-modal' style={{backgroundColor: 'rgba(0,0,0,.35)', height: '100vh', width: '100vw', position: 'absolute', top: '0', zIndex: 397}}>
                <div  style={{width: '400px', maxWidth:'90%', position:'fixed', left: '50%', top: '15%', transform: 'translate(-50%, 0)', zIndex: 398, boxShadow: '10px 10px #888'}}>
                    <div id='node-modal-header' style={{padding: '16px', borderRadius: '2px 2px 0px 0px', backgroundColor: ' #2e86c1 ', border: '1px solid black', borderBottom: '0px'}}>
                        <b style={{color: 'white', fontSize: '18px'}}>CUSTOMER FORM</b> <input name='node-search' value={this.state.nodeSearch} onChange={(e) => this.setNodeTemplateFilterResults(e)} placeholder="Search template" style={{width: '150px', display: 'inline', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid white', color: 'white', marginLeft: '10px' }} />
                        <button id='node-modal-close' onClick={this.props.closeModal} className='glyphicon glyphicon-remove-sign btn-danger' style={{position: 'absolute', right: '10px', top: '10px', color: '#FF3933 ', padding: '2px', cursor: 'pointer', borderRadius: '100%', backgroundColor: 'white', fontSize: '25px'}} />
                        <div id='node-filter-results' style={{width: '250px', position: 'absolute', top: '50px', right: '50px', zIndex: 399}} >
                            {this.getNodeTemplateFilterResults()}
                        </div>
                    </div>
                    <div id='node-modal-body'  style={{padding: '16px', borderRadius: '0px 0px 2px 2px', border: '1px solid black', backgroundColor: 'white'}} >
                        <form onSubmit={(e)=>this.saveNode(e)} id='node-modal-form'>

                            <input name='id' id='node-id' className=' form-control input-sm' type='hidden' value={this.props.node.id} required readOnly />
                            <input name='x' id='node-x'  className=' form-control input-sm' type='hidden' value={this.props.node.x}  required readOnly />
                            <input name='y' id='node-y' className=' form-control input-sm' type='hidden' value={this.props.node.y}  required readOnly />

                            <div className='form-group row'>
                                <label className='col-xs-3 col-form-label'>Name</label>
                                <div className='col-xs-9'>
                                    <input name='name' id='node-name' className=' form-control input-sm' type='text' value={this.state.name}  onChange={(e)=>{this.setState({name: e.target.value})}} placeholder="Customer, Company ..." required  />
                                </div>
                            </div>

                            <div className='form-group row'>
                                <label className='col-xs-3 col-form-label'>Network</label>
                                <div className='col-xs-9'>
                                    <div className='row'>
                                        <div className='col-sm-8'>
                                            <b>IP</b> <a className='pull-right pointer-link' onClick={(e)=>{this.addIpField(e)}}>add</a>
                                            <div>
                                                {this.showIpFields()}
                                            </div>
                                        </div>
                                        <div className='col-sm-4'>
                                            <b>VLAN</b> <a className='pull-right pointer-link' onClick={(e)=>{this.addVlanField(e)}}>add</a>
                                            <div>
                                                {this.showVlanFields()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='form-group row'>
                                <label className='col-xs-3 col-form-label'>Provider</label>
                                <div className='col-xs-9'>
                                    <input name='provider' id='node-vendor' className=' form-control input-sm' type='text' value={this.state.provider} onChange={(e)=>{this.setState({provider: e.target.value})}} placeholder="Use search template for a quick selection." required  />
                                </div>
                            </div>

                            <div className='form-group row'>
                                <label className='col-xs-3 col-form-label'>Priority</label>
                                <div className='col-xs-9'>
                                    <div className='row'>
                                        <div className='col-xs-8'>
                                            <input name='priority' required type="range"  value={this.state.priority} className="form-control input-sm" min='1' max='3' step='1' onChange={(e)=>{this.setState({priority: parseInt(e.target.value, 10)})}} onInput={(e)=>{this.setState({priority: parseInt(e.target.value, 10)})}}/>
                                        </div>
                                        <div className='col-xs-4' style={{textAlign: 'center'}}>
                                            <div className='badge badge-pill' style={{padding: '9px', width: '100%'}}>{textifyPriority(this.state.priority)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='form-group row'>
                                <label className='col-xs-3 col-form-label'>Tags</label>
                                <div className='col-xs-9'>
                                    <ReactTags
                                        tags={this.state.tags}
                                        suggestions={this.state.suggestions}
                                        handleAddition={this.handleAddition.bind(this)}
                                        handleDelete={this.handleDelete.bind(this)}
                                        allowDeleteFromEmptyInput={false}
                                        maxLength = "16"
                                        classNames={{
                                            tags: 'ReactTags__tags',
                                            tagInput: 'ReactTags__tagInput',
                                            tagInputField: 'form-control ReactTags__tagInputField',
                                            selected: 'ReactTags__selected',
                                            tag: 'ReactTags__selected ReactTags__tag',
                                            remove: 'ReactTags__selected ReactTags__remove',
                                            suggestions: 'ReactTags__suggestions',
                                            activeSuggestion: 'ReactTags__activeSuggestion'
                                        }}
                                    />
                                </div>
                            </div>

                            <div className='form-group row'>
                                <label className='col-xs-3 col-form-label'>Image</label>
                                <div className='col-xs-9'>
                                    <input name='image' id='node-image' className=' form-control input-sm' type='text'  value={this.state.image} onChange={(e)=>this.setState({image: e.target.value, photo: e.target.value})} placeholder="Use search template for a quick selection." required  />
                                </div>
                            </div>

                            <div style={{textAlign: 'center'}}>
                                <img id='node-photo' src={SERVER_URL+'/img/'+this.state.image} style={{height: '150px', margin: 'auto'}} alt=''/>
                            </div>
                            {this.state.error ? <div className="alert alert-danger" style={{textAlign: 'center'}}>Oops, something wrong just happened.</div> : null}
                            <br />
                            {this.state.saving ? <button className='btn btn-warning form-control' disabled>Saving...</button>: <button id='node-save'className='btn btn-success form-control' >Save</button>}
                            <br />
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}


export default CustomerNodeModal
