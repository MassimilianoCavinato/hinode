import React from 'react'
import axios from 'axios'
import { WithContext as ReactTags } from 'react-tag-input'
import { SERVER_URL } from '../config/config'

class NodeModal extends React.Component{

    constructor(props){
        super(props)
        this.state =  {
           nodeTemplates: [],
           nodeTemplateFilterResults: [],
           nodeSearch: '',
           saveError: false,
           saving: false,
           vendor: this.props.node.vendor || '',
           type: this.props.node.type || '',
           model: this.props.node.model || '',
           name: this.props.node.name || '',
           tags: this.props.node.tags || '',
           image: this.props.node.image || '',
           ip: this.props.node.ip || '',
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
            let nodeTemplates = response.data.filter(template => template.group === "Device")
            this.setState({
                nodeTemplates: nodeTemplates,
            })
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
            filteredNodeTemplates = this.state.nodeTemplates.filter(nodeTemplate => {
                return nodeTemplate.type.toLowerCase().includes(search_text) ||
                    nodeTemplate.vendor.toLowerCase().includes(search_text) ||
                    nodeTemplate.model.toLowerCase().includes(search_text)
            })
        }

        this.setState({
            nodeTemplateFilterResults: filteredNodeTemplates,
            nodeSearch: search_text,

        })
    }

    getNodeTemplateFilterResults(){

        let nodeTemplateFilterResults = this.state.nodeTemplateFilterResults.map(nodeTemplate => {
            return(
                <div key={nodeTemplate._id} style={{padding: "4px", border: '1px solid gray', borderRadius: '2px', marginBottom: '2px', backgroundColor: '#DDD', cursor: 'pointer', height: '50px'}} onClick={(e) => {this.selectNodeTemplate(e, {type: nodeTemplate.type, vendor: nodeTemplate.vendor, model: nodeTemplate.model, tags: nodeTemplate.tags, image: nodeTemplate.image})}}>
                    <img src={SERVER_URL+'/img/'+nodeTemplate.image}  style={{height: '40px', width: '40px', float: 'right'}} alt='' />
                    <b>{nodeTemplate.vendor} {nodeTemplate.type}</b>
                    <br />
                    {nodeTemplate.model}
                </div>
            )
        })
        return nodeTemplateFilterResults
    }

    selectNodeTemplate(e, nodeTemplate){
        this.setState({
            nodeTemplateFilterResults: [],
            nodeSearch: '',
            type: nodeTemplate.type,
            vendor: nodeTemplate.vendor,
            model: nodeTemplate.model,
            tags: nodeTemplate.tags,
            image: nodeTemplate.image,
        })

    }

    saveNode(e){
        e.preventDefault()
        this.setState({saving: true})
        let newNode = {
            id: e.target.id.value,
            x: e.target.x.value,
            y: e.target.y.value,
            ip: e.target.ip.value,
            vendor: e.target.vendor.value,
            type: e.target.type.value,
            model: e.target.model.value,
            name: e.target.name.value,
            image: e.target.image.value,
            tags: this.state.tags,
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

    render(){
        return(
            <div id='node-modal' style={{backgroundColor: 'rgba(0,0,0,.35)', height: '100vh', width: '100vw', position: 'absolute', top: '0', zIndex: 397}}>
                <div  style={{width: '400px', maxWidth:'90%', position:'fixed', left: '50%', top: '15%', transform: 'translate(-50%, 0)', zIndex: 398, boxShadow: '10px 10px #888'}}>
                    <div id='node-modal-header' style={{padding: '16px', borderRadius: '2px 2px 0px 0px', backgroundColor: ' #2e86c1 ', border: '1px solid black', borderBottom: '0px'}}>
                        <b style={{color: 'white', fontSize: '18px'}}>DEVICE FORM</b> <input name='node-search' value={this.state.nodeSearch} onChange={(e) => this.setNodeTemplateFilterResults(e)} placeholder="Search template" style={{width: '200px', display: 'inline', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid white', color: 'white', marginLeft: '10px' }} />
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
                                <label className='col-xs-3 col-form-label'>Ip</label>
                                <div className='col-xs-9'>
                                    <input name='ip' id='node-ip' className=' form-control input-sm' type='text' value={this.state.ip} onChange={(e)=>{this.setState({ip: e.target.value})}} placeholder="8.8.8.8"  pattern="^([0-9]{1,3}\.){3}[0-9]{1,3}$" required  />
                                </div>
                            </div>

                            <div className='form-group row'>
                                <label className='col-xs-3 col-form-label'>Name</label>
                                <div className='col-xs-9'>
                                    <input name='name' id='node-name' className=' form-control input-sm' type='text' value={this.state.name}  onChange={(e)=>{this.setState({name: e.target.value})}} placeholder="Use search template for a quick selection." required  />
                                </div>
                            </div>

                            <div className='form-group row'>
                                <label className='col-xs-3 col-form-label'>Vendor</label>
                                <div className='col-xs-9'>
                                    <input name='vendor' id='node-vendor' className=' form-control input-sm' type='text' value={this.state.vendor} onChange={(e)=>{this.setState({vendor: e.target.value})}} placeholder="Use search template for a quick selection." required  />
                                </div>
                            </div>

                            <div className='form-group row'>
                                <label className='col-xs-3 col-form-label'>Type</label>
                                <div className='col-xs-9'>
                                    <input name='type' id='node-type' className=' form-control input-sm' type='text' value={this.state.type}  onChange={(e)=>{this.setState({type: e.target.value})}} placeholder="Use search template for a quick selection." required  />
                                </div>
                            </div>

                            <div className='form-group row'>
                                <label className='col-xs-3 col-form-label'>Model</label>
                                <div className='col-xs-9'>
                                    <input name='model' id='node-model' className=' form-control input-sm' type='text' value={this.state.model}  onChange={(e)=>{this.setState({model: e.target.value})}} placeholder="Use search template for a quick selection." required  />
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


export default NodeModal
