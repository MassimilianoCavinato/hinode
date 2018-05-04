import React from 'react'
import axios from 'axios'
import { SERVER_URL } from '../config/config'


class EdgeModal extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            saveError: false,
            saving: false
        }
    }

    saveEdge(e){
        e.preventDefault()
        let newEdge = {
            id: e.target.id.value,
            label: e.target.label.value,
            type: e.target.type.value,
            from: e.target.from.value,
            to: e.target.to.value
        }
        this.setState({saving: true})

        axios.post(SERVER_URL+'/api/networkgraph/saveedge', newEdge)
        .then((response) => {
            if(response.data.ok){
                this.setState({saving: false, saveError: false})
                this.props.closeModal()
                this.props.refreshNetwork()
            }else{
                this.setState({saving: false, saveError: true})
            }
        })
        .catch((error) => {
            console.log(error)
            this.setState({saving: false, saveError: true})
        })
    }

    render(){
        return(
            <div id='edge-modal' style={{backgroundColor: 'rgba(0,0,0,.35)', height: document.body.clientHeight, width: document.body.clientWidth, position: 'absolute', top: '0', zIndex: 397}}>
                <div  style={{width: '400px', maxWidth:'90%', position:'absolute', left: '50%', top: '15%', transform: 'translate(-50%, 0)', zIndex: 398, boxShadow: '10px 10px #888'}}>
                    <div id='edge-modal-header' style={{padding: '16px', borderRadius: '2px 2px 0px 0px', backgroundColor: ' #2e86c1 ', border: '1px solid black', borderBottom: '0px'}}>
                        <b style={{color: 'white', fontSize: '18px'}}>EDGE FORM</b>
                        <button id='edge-modal-close' onClick={this.props.closeModal} className='glyphicon glyphicon-remove-sign btn-danger' style={{position: 'absolute', right: '10px', top: '10px', color: '#FF3933 ', padding: '2px', cursor: 'pointer', borderRadius: '100%', backgroundColor: 'white', fontSize: '25px'}} />
                    </div>
                    <div id='edge-modal-body'  style={{padding: '16px', borderRadius: '0px 0px 2px 2px', border: '1px solid black', backgroundColor: 'white'}} >
                        <form onSubmit={(e)=>this.saveEdge(e)} id='edge-modal-form'>
                            <div className='form-group row'>
                                <label className='col-xs-3 col-form-label'>Id</label>
                                <div className='col-xs-9'>
                                    <input name='id' id='edge-id' className=' form-control input-sm' type='text' value={this.props.edge.id} required readOnly />
                                </div>
                            </div>
                            <div className='form-group row'>
                                <label className='col-xs-3 col-form-label'>From</label>
                                <div className='col-xs-9'>
                                    <input name='from' id='edge-from' className=' form-control input-sm' type='text' value={this.props.edge.from} required readOnly />
                                </div>
                            </div>
                            <div className='form-group row'>
                                <label className='col-xs-3 col-form-label'>To</label>
                                <div className='col-xs-9'>
                                    <input name='to' id='edge-to' className=' form-control input-sm' type='text' value={this.props.edge.to} required readOnly />
                                </div>
                            </div>
                            <div className='form-group row'>
                                <label className='col-xs-3 col-form-label'>Label</label>
                                <div className='col-xs-9'>
                                    <input name='label' id='edge-label' className=' form-control input-sm' type='text' placeholder='Optional' />
                                </div>
                            </div>
                            <div className='form-group row'>
                                <label className='col-xs-3 col-form-label'>Type</label>
                                <div className='col-xs-9'>
                                    <select name='type' id='edge-type' className=' form-control input-sm'  required>
                                        <option>Wireless</option>
                                        <option>Copper</option>
                                        <option>Fiber</option>
                                    </select>
                                </div>
                            </div>
                            {this.state.error ? <div className="alert alert-danger" style={{textAlign: 'center'}}>Oops, something wrong just happened.</div> : null}
                            <br />
                            {this.state.saving ? <button className='btn btn-warning form-control' disabled>Saving...</button>: <button id='edge-save'className='btn btn-success form-control' >Save</button>}
                            <br />
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}


export default EdgeModal
