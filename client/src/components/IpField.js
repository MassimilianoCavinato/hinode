import React from 'react'

class IpField extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            ip: this.props.ip
        }
    }

    render(){
        return(
            <input name='ip[]' className='form-control input-sm' style={{marginBottom: '4px'}} type='text' value={this.state.ip} onChange={(e) => {this.setState({ip: e.target.value})}}/>
        )
    }
}

export default IpField
