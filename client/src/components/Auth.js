import React from 'react'
import Signin from './Signin'
import Signup from './Signup'
import { connect } from 'react-redux'

class Auth extends React.Component{

    renderAuth(){

        switch(this.props.auth.render){
            case 'signin': return <Signin />
            case 'signup': return <Signup />
            default: return <Signin />
        }
    }

    render(){
        return(
            <div style={{position: 'absolute', margin: 'auto', top: '0', bottom: '0', right: '0', left: '0', height: '400px', width: '100%'}}>
                {this.renderAuth()}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    auth:state.auth,
})

export default connect(mapStateToProps)(Auth)
