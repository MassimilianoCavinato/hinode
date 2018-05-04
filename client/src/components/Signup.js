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
                return <div style={{backgroundColor: 'rgba(255,0,0,.6)', color: 'white', textAlign: 'center', padding: '8px', marginTop: '4px', borderRadius: '4px'}}>{signinerror}</div>
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
            <div style={{margin: '0 auto', width: '300px', position: 'relative'}}>
                <div style={{backgroundColor: 'rgba(50, 50, 50, .5)', padding: '0px 8px', borderRadius: '4px 4px 0px 0px', textAlign: 'center', color: 'white', border: '2px outset #BBB'}}>
                    <img src={logo} style={{width: '150px'}} alt=''/>
                </div>
                <div style={{backgroundColor: 'rgba(50, 50, 50, .5)', padding: '8px 24px', borderRadius: '0px 0px 4px 4px', textAlign: 'center',  border: '2px outset #BBB'}}>
                    <form onSubmit={this.onSignup.bind(this)}>
                        <br />
                        <div style={{position: 'relative'}}>
                            <i className="glyphicon glyphicon-user" style={{position: 'absolute', top: '8px', right: '8px', color: '#FFF'}}></i>
                            <input ref='username' type="text" className='form-control input-sm' autoFocus required placeholder='Username' style={{backgroundColor: 'rgba(0,0,0,.85)', color: 'white'}} pattern="[a-zA-Z0-9 ]+" minLength="4" size="10" onKeyPress={(e)=> { this.noSpaces(e)} } />
                        </div>
                        <br />
                        <div style={{position: 'relative'}}>
                            <i className="glyphicon glyphicon-envelope" style={{position: 'absolute', top: '8px', right: '8px', color: '#FFF'}}></i>
                            <input ref='email' type="email" className='form-control input-sm'  required placeholder='Email' style={{backgroundColor: 'rgba(0,0,0,.85)', color: 'white'}} />
                        </div>
                        <br />
                        <div style={{position: 'relative'}}>
                            <i className="glyphicon glyphicon-lock" style={{position: 'absolute', top: '8px', right: '8px', color: '#FFF'}}></i>
                            <input ref='password' type="password" className='form-control input-sm ' required placeholder='Password' style={{backgroundColor: 'rgba(0,0,0,.85)', color: 'white'}} minLength="6" />
                        </div>
                        <br />
                        <div style={{position: 'relative'}}>
                            <i className="glyphicon glyphicon-lock" style={{position: 'absolute', top: '8px', right: '8px', color: '#FFF'}}></i>
                            <input ref='password_confirm' type="password" className='form-control input-sm ' required placeholder='Confirm password' style={{backgroundColor: 'rgba(0,0,0,.85)', color: 'white'}} />
                        </div>
                        <br />
                        <button type='submit' style={{margin: '0 auto', width: "100px", borderRadius: '2px', backgroundColor: 'rgba(50,50,50,.5)', color: 'white', marginBottom: '16px'}}>Sign Up</button>
                    </form>
                    <br />
                    <a  style={{fontSize: '12px', cursor: 'pointer', color: 'white'}} onClick={() => this.showSignin()}>Sign In with your account</a>
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
