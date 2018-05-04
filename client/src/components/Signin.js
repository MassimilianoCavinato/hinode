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
            <div style={{margin: '0 auto', width: '300px', position: 'relative'}}>
                <div style={{backgroundColor: 'rgba(50, 50, 50, .5)', padding: '0px 8px', borderRadius: '4px 4px 0px 0px', textAlign: 'center', color: 'white', border: '2px outset #BBB'}}>
                    <img src={logo} style={{width: '150px'}} alt=''/>
                </div>
                <div style={{backgroundColor: 'rgba(50, 50, 50, .5)', padding: '8px 24px', borderRadius: '0px 0px 4px 4px', textAlign: 'center',  border: '2px outset #BBB'}}>
                    <form onSubmit={this.onSignin.bind(this)}>
                        <br />
                        <div style={{position: 'relative'}}>
                            <i className="glyphicon glyphicon-envelope" style={{position: 'absolute', top: '8px', right: '8px', color: '#FFF'}}></i>
                            <input ref='email' type="email" className='form-control input-sm' autoFocus required placeholder='Email' style={{backgroundColor: 'rgba(0,0,0,.85)', color: 'white'}}/>
                        </div>
                        <br />
                        <div style={{position: 'relative'}}>
                            <i className="glyphicon glyphicon-lock" style={{position: 'absolute', top: '8px', right: '8px', color: '#FFF'}}></i>
                            <input ref='password' type="password" className='form-control input-sm ' required placeholder='Password' style={{backgroundColor: 'rgba(0,0,0,.85)', color: 'white'}}/>
                            <div style={{textAlign: 'right', fontSize: '12px', color: 'white', marginTop: '4px'}}>
                                Remember me <input ref="remember" type="checkbox" />
                            </div>
                        </div>
                        <br />
                        <button type='submit' style={{width: "100px", borderRadius: '2px', backgroundColor: 'rgba(50,50,050,.5)', color: 'white'}}>Sign In</button>
                        <br />
                        <br />
                        <a  style={{fontSize: '12px', cursor: 'pointer', color: 'white'}} onClick={() => this.showSignup()}>Not registered?</a>
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
