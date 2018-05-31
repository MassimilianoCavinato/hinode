import React from 'react'
import { SERVER_URL } from '../config/config'
import axios from 'axios'
import { WithContext as ReactTags } from 'react-tag-input'

class EditDeviceTemplateForm extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            template: this.props.template,
            _id: this.props.template._id,
            type:  this.props.template.type,
            vendor:  this.props.template.vendor,
            model:  this.props.template.model,
            image:  '',
            tags:  this.props.template.tags,
            suggestions: [],
            imagePreview: this.props.template.image,
            resetImage: false
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

    editNodeTemplate(e){

        e.preventDefault()

        if(this.state.image === ""){
            let re = new RegExp(SERVER_URL+'/img/', 'g')
            this.setState({image: this.props.template.image.replace(re, '')}, () => {
                this.updateTemplate()
            })
        }
        else{
            this.uploadImage()
        }
    }

    updateTemplate(){

        let template = {
            _id: this.state._id,
            type:  this.state.type,
            vendor:  this.state.vendor,
            model:  this.state.model,
            image:  this.state.image,
            tags:  this.state.tags
        }

        axios.put(SERVER_URL+'/api/nodetemplates/editnodetemplate', template)
        .then((response) => {
            console.log('response', response)
            if(response.data.ok){
                this.props.getTemplates()
                this.props.switchToReadMode()
            }
            else{
                console.log(response.data.error)
            }
        })
        .catch((error) => {
            console.log(error)
        })
    }

    uploadImage(){

        let formData = new FormData();
        formData.append('file', this.state.image)
        //attempt to upload the image first, retrieve ref link from server and then save node template
        axios.post(SERVER_URL+'/api/upload/img', formData, {headers: {'Content-Type': 'multipart/form-data'}})
        .then((response) => {
            if(response.data.ok){
                console.log('Image uploaded succesfully.')
                this.setState({image: response.data.data}, () => {
                    this.updateTemplate()
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
            imagePreview: this.props.template.image,
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
                            <h1>Edit Device Template</h1>
                        </div>
                    </div>

                    <form>

                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Template Id</label>
                            <div className="col-sm-8">
                                <input type="text"  value={this.props.template._id} className="form-control input-sm" placeholder='Radio, Switch, Sector ...' readOnly/>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Type</label>
                            <div className="col-sm-8">
                                <input type="text"  value={this.state.type} className="form-control input-sm" placeholder='Radio, Switch, Sector ...' onChange={(e)=>{this.setState({type: e.target.value})}}/>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Vendor</label>
                            <div className="col-sm-8">
                                <input type="text"  value={this.state.vendor} className="form-control input-sm" placeholder='Juniper, Cisco, Ubiquiti ...'  onChange={(e)=>{this.setState({vendor: e.target.value})}}/>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Model</label>
                            <div className="col-sm-8">
                                <input type="text"  value={this.state.model} className="form-control input-sm" placeholder='Device Model, Name ...'  onChange={(e)=>{this.setState({model: e.target.value})}}/>
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
                                    />
                                    <span className="custom-file-control"></span>
                                </label>
                                {this.resetImageButton()}
                            </div>
                        </div>

                        <div className="form-group row">
                            <div className="col-sm-offset-4 col-sm-8">
                                <button className='btn btn-success form-control' onClick={(e) => {this.editNodeTemplate(e)}}>Edit</button>
                            </div>
                        </div>

                    </form>
                </div>

                <div className='col-sm-6' style={{textAlign: 'center'}}>
                    <img src={this.state.imagePreview} alt='' style={{height: '300px', width: '300px', objectFit: 'contain', border: '1px solid #ddd', borderRadius: '8px', marginTop: '80px'}}/>
                </div>
            </div>
        )
    }
}

export default EditDeviceTemplateForm
