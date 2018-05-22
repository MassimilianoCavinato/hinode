import React from 'react'
import axios from 'axios'
import logo from '../img/HI-logo-transparent.png'
import { connect } from 'react-redux'
import { SERVER_URL } from '../config/config'

class Signup extends React.Component{

    onSignup(e){
        e.preventDefault()
        axios.post(SERVER_URL+'/api/authentication/signup', {
            username: this.refs.username.value.trim().replace(/\s\s+/g, ' '),
            email: this.refs.email.value,
            password: this.refs.password.value,
            password_confirm: this.refs.password_confirm.value
        })
        .then((response) => {
            this.props.onSignup(response.data)
        }).catch((error)=>{
            return error
        })
    }

    showSignupErrors(){
        return(
            this.props.auth.error.signup.length > 0 ?
            this.props.auth.error.signup.map((signinerror) => {
                return <div className='auth-error'>{signinerror}</div>
            })
            :
            null
        )
    }

    showSignin(){
        this.props.showSignin()
    }


    noSpaces(e){
        if(e.which === 32){
            e.preventDefault()
            return false
        }
    }

    render(){
        return(
            <div>
                <div className='auth-header'>
                    <img src={logo} alt=''/>
                </div>
                <div className='auth-body'>
                    <form onSubmit={this.onSignup.bind(this)} className='auth-form'>
                        <br />
                        <div style={{position: 'relative'}}>
                            <i className="glyphicon glyphicon-user"></i>
                            <input
                                ref='username'
                                type="text"
                                 className='form-control input-sm'
                                 autoFocus
                                 required
                                 placeholder='Username'
                                 pattern="[a-zA-Z0-9 ]+"
                                 minLength="4"
                                 size="10"
                                 onKeyPress={(e)=> { this.noSpaces(e)} }
                                 autoComplete="new-username"
                             />
                        </div>
                        <br />
                        <div style={{position: 'relative'}}>
                            <i className="glyphicon glyphicon-envelope"></i>
                            <input
                                ref='email'
                                type="email"
                                className='form-control input-sm'
                                required
                                placeholder='Email'
                                autoComplete="new-email"
                            />
                        </div>
                        <br />
                        <div style={{position: 'relative'}}>
                            <i className="glyphicon glyphicon-lock"></i>
                            <input
                                ref='password'
                                type="password"
                                className='form-control input-sm '
                                required placeholder='Password'
                                minLength="6"
                                autoComplete="new-password"
                            />
                        </div>
                        <br />
                        <div style={{position: 'relative'}}>
                            <i className="glyphicon glyphicon-lock"></i>
                            <input
                                ref='password_confirm'
                                type="password"
                                className='form-control input-sm '
                                required placeholder='Confirm password'
                                autoComplete="new-password_confirm"
                            />
                        </div>
                        <br />
                        <button type='submit'>Sign Up</button>
                    </form>
                    <br />
                    <a onClick={() => this.showSignin()}>Sign In with your account</a>
                </div>
                {this.showSignupErrors()}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    auth:state.auth
})

const mapDispatchToProps = (dispatch) => {
  return {
    onSignup: (data) => dispatch({
        type: 'onSignup',
        payload: data
    }),
    showSignin: () => dispatch({
        type: 'showSignin',
        payload: {render: 'signin'}
    })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup)
