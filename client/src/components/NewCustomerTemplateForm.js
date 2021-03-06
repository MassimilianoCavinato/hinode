import React from 'react'
import { SERVER_URL } from '../config/config'
import axios from 'axios'
import { textifyPriority } from '../utils/utils.js'
import { WithContext as ReactTags } from 'react-tag-input'

class NewCustomerTemplateForm extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            template_name: '',
            provider: '',
            priority: 2,
            image: '',
            tags: [],
            suggestions: [],
            imagePreview: '',
            resetImage: false,
        }
    }

    componentDidMount(){
        this.getTags()
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

    createNodeTemplate(e){

        e.preventDefault()

        let formData = new FormData();
        formData.append('file', this.state.image)

        //attempt to upload the image first, retrieve ref link from server and then save node template
        axios.post(SERVER_URL+'/api/upload/img', formData, {headers: {'Content-Type': 'multipart/form-data'}})
        .then((response) => {
            if(response.data.ok){

                console.log('Image uploaded succesfully.')

                let template = {
                    group: 'Customer',
                    template_name: this.state.template_name,
                    provider: this.state.provider,
                    priority: this.state.priority,
                    tags: this.state.tags,
                    image: response.data.data
                }
                axios.post(SERVER_URL+'/api/nodetemplates/createnodetemplate', template)
                .then((response) => {
                    if(response.data.ok){
                        this.props.getTemplates()
                        this.props.switchToReadMode()
                    }else{
                        console.log(response.data.error)
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
            }
            else{
                console.log(response.data.error)
            }
        })
        .catch((error) => {
            console.log(error)
        })
    }

    handleDelete(i) {

        let template = this.state.template
        template.tags.splice(i, 1)
        this.setState({template: template})
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

    validateImageFile(e){

        let allowedFileTypes = ['image/jpg', 'image/jpeg', 'image/png']
        let maxFileSize = 5242880 //5Mb
        let file = e.target.files[0]

        if(allowedFileTypes.indexOf(file.type) > -1 && file.size <= maxFileSize){

            let reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onloadend = () => {
                this.setState({
                    image: file,
                    imagePreview: reader.result,
                    resetImage: true
                })
            }
        }
        else{

            this.setState({
                image: '',
                imagePreview: '',
                resetImage: false
            })

            if(allowedFileTypes.indexOf(file.type) === -1){
                console.log('Only .png, .jpg, .jpeg allowed')
            }
            if(file.size > maxFileSize){
                console.log('This file is too large, max 5Mb allowed')
            }
        }
    }

    resetImageButton(){

        return (
            this.state.resetImage ?
            <a onClick={()=>{this.resetImage()}}>Remove</a>
            :
            null
        )
    }

    resetImage(){
        this.refs.file.value = ''
        this.setState({
            imagePreview: '',
            image: '',
            resetImage: false
        })
    }

    render(){

        return(
            <div className='row'>
                <div className='col-sm-6'>
                    <div className="form-group row">
                        <div className="col-sm-4 col-form-label">
                            <button onClick={() => this.props.switchToReadMode()}className='btn btn-warning' style={{marginTop: 24}}><span className='glyphicon glyphicon-backward' /> Back</button>
                        </div>
                        <div className="col-sm-8">
                            <h1>New Customer Template</h1>
                        </div>
                    </div>
                    <form onSubmit={(e) => {this.createNodeTemplate(e)}} encType="multipart/form-data">
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Template Name</label>
                            <div className="col-sm-8">
                                <input required type="text"  value={this.state.template_name} className="form-control input-sm" placeholder='Dedicated, Shared, ...' onChange={(e)=>{this.setState({template_name: e.target.value})}}/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Provider</label>
                            <div className="col-sm-8">
                                <input required type="text"  value={this.state.provider} className="form-control input-sm" placeholder='Host Ireland, Vodafone, Magnet, ...'  onChange={(e)=>{this.setState({provider: e.target.value})}}/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Priority</label>
                            <div className="col-sm-4">
                                <input required type="range"  value={this.state.priority} className="form-control input-sm" min='1' max='3' step='1' onChange={(e)=>{this.setState({priority: parseInt(e.target.value, 10)})}} onInput={(e)=>{this.setState({priority: parseInt(e.target.value, 10)})}} style={{marginBottom: '4px'}}/>
                            </div>
                            <div className="col-sm-4" style={{textAlign: 'center'}}>
                                <div className='badge badge-pill' style={{padding: '9px', width: '100%'}}>{textifyPriority(this.state.priority)}</div>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Tags</label>
                            <div className="col-sm-8">
                                <ReactTags
                                    tags={this.state.tags}
                                    suggestions={this.state.suggestions}
                                    handleAddition={this.handleAddition.bind(this)}
                                    handleDelete={this.handleDelete.bind(this)}
                                    allowDeleteFromEmptyInput={false}
                                    maxLength = "12"
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

                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Image</label>
                            <div className="col-sm-8">
                                <label className="custom-file">
                                    <input
                                        type='file'
                                        ref='file'
                                        onChange={(e) => {this.validateImageFile(e)}}
                                        accept=".png, .jpg, .jpeg"
                                        className='custom-file-input'
                                        required
                                    />
                                    <span className="custom-file-control"></span>
                                </label>
                                {this.resetImageButton()}
                            </div>
                        </div>

                        <div className="form-group row">
                            <div className="col-sm-offset-4 col-sm-8">
                                <button className='btn btn-success form-control'>Create</button>
                            </div>
                        </div>

                    </form>
                </div>
                <div className='col-sm-6' style={{textAlign: 'center'}}>
                    <img src={this.state.imagePreview} alt='' style={{width: '300px', height: '300px', objectFit: 'cover', marginTop: '100px', border: '1px solid #bbb'}}/>
                </div>
            </div>
        )
    }
}

export default NewCustomerTemplateForm
