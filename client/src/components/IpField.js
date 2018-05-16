import React from 'react'

class IpField extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            ip: this.props.data.ip
        }
    }

    showIpField() {

        if(this.props.isList){
            return(
                <div style={{position: 'relative'}}>
                    <input
                        type='text'
                        name='ip[]'
                        value={this.state.ip}
                        onChange={(e) => {this.setState({ip: e.target.value}); this.props.updateIp(this.props.data.id, e.target.value);}}
                        required
                        pattern="^([0-9]{1,3}\.){3}[0-9]{1,3}(\/([0-9]|[1-2][0-9]|3[0-2]))?$"
                        maxLength="18"
                        className='form-control input-sm'
                        style={{marginBottom: '4px'}}
                    />
                    <button onClick={(e) => { e.preventDefault(); this.props.removeIpField(this.props.data.id);}} style={{position: 'absolute', top: '5px', right: '1px', color: 'gray', border: 'none', backgroundColor: 'transparent'}}>
                        <span className='glyphicon glyphicon-remove' />
                    </button>
                </div>
            )
        }
        else{
            return (
                <input
                    type='text'
                    name='ip[]'
                    value={this.state.ip}
                    onChange={(e) => {this.setState({ip: e.target.value})}}
                    required
                    pattern="^([0-9]{1,3}\.){3}[0-9]{1,3}(\/([0-9]|[1-2][0-9]|3[0-2]))?$"
                    className='form-control'
                />
            )
        }
    }

    render(){
        return(
            this.showIpField()
        )
    }
}

export default IpField
