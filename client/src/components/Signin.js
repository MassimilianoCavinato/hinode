import React from 'react'
import logo from '../img/HI-logo-transparent.png'
import { connect } from 'react-redux'
import axios from 'axios'
import { SERVER_URL } from '../config/config'

class Signin extends React.Component{

    onSignin(e){

        e.preventDefault()
        axios.post(SERVER_URL+'/api/authentication/signin', {email: this.refs.email.value, password: this.refs.password.value})
        .then((response) => {
            this.props.onSignin(Object.assign({}, response.data, {remember: this.refs.remember.checked}))
        }).catch((error)=>{
            console.log(error)
        })
    }

    showSigninErrors(){
        return(
            this.props.auth.error.signin.length > 0 ?
            this.props.auth.error.signin.map((signinerror) => {
                return <div style={{backgroundColor: 'rgba(255,0,0,.8)', color: 'white', textAlign: 'center', padding: '8px', marginTop: '4px', borderRadius: '8px'}}>{signinerror}</div>
            })
            :
            null
        )
    }

    showSignup(){
        this.props.showSignup()
    }

    render(){
        return(
            <div>
                <div className='auth-header'>
                    <img src={logo} alt=''/>
                </div>
                <div className='auth-body'>
                    <form className='auth-form' onSubmit={this.onSignin.bind(this)}>
                        <br />
                        <div style={{position: 'relative'}}>
                            <i className="glyphicon glyphicon-envelope"></i>
                            <input ref='email' type="email" className='form-control input-sm' autoFocus required placeholder='Email'/>
                        </div>
                        <br />
                        <div style={{position: 'relative'}}>
                            <i className="glyphicon glyphicon-lock"></i>
                            <input ref='password' type="password" className='form-control input-sm ' required placeholder='Password'/>
                            <div id='signin-remember-me-container'>
                                Remember me <input ref="remember" type="checkbox" />
                            </div>
                        </div>
                        <br />
                        <button type='submit'>Sign In</button>
                        <br />
                        <br />
                        <a  style={{}} onClick={() => this.showSignup()}>Not registered?</a>
                    </form>
                </div>
                {this.showSigninErrors()}
            </div>
        )
    }
}
const mapStateToProps = (state) => ({
    auth:state.auth
})

const mapDispatchToProps = (dispatch) => {
  return {
    onSignin: (data) => dispatch({
        type: 'onSignin',
        payload: data
    }),
    showSignup: () => dispatch({
        type: 'showSignup',
        payload: {render: 'signup'}
    })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Signin)
