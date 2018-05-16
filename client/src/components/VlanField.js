import React from 'react'

class VlanField extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            vlan: this.props.vlan
        }
    }

    showIpField() {

        if(this.props.isList){
            return(
                <div style={{position: 'relative'}}>
                    <input
                        type='text'
                        name='vlan[]'
                        value={this.state.vlan}
                        required
                        onChange={(e) => {this.setState({vlan: e.target.value})}}
                        pattern="(?:[1-9]\d{0,2}|[1-3]\d{3}|40(?:[0-8]\d|9[0-3]))"
                        maxlength="4"
                        className='form-control input-sm'
                        style={{marginBottom: '4px'}}
                    />

                    <button onClick={(e) => { e.preventDefault(); this.props.removeVlanField(this.props.key);}} style={{position: 'absolute', top: '5px', right: '1px', color: 'gray', border: 'none', backgroundColor: 'transparent'}}>
                        <span className='glyphicon glyphicon-remove' />
                    </button>
                </div>
            )
        }
        else{
            return (
                <input
                    type='text'
                    name='vlan' 
                    value={this.state.vlan}
                    required
                    onChange={(e) => {this.setState({vlan: e.target.value})}}
                    pattern="(?:[1-9]\d{0,2}|[1-3]\d{3}|40(?:[0-8]\d|9[0-3]))"
                    maxlength="4"
                    className='form-control'
                    style={{marginBottom: '4px'}}
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

export default VlanField
