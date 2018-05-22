import React  from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import Loading from './Loading'
import Auth from './Auth'
import Menu from './Menu'
import { SERVER_URL } from '../config/config'

class HiNode extends React.Component {

    constructor(props){

        super(props)
        this.state = {loading: true}
    }

    componentWillMount(){

        let user = this.props.auth.user

        if(user !== null){

            axios.post(SERVER_URL+'/api/authentication/session_token', {_id: user._id, session_token: user.session_token})
            .then((response) => {

                if(!response.data){
                    sessionStorage.clear()
                    localStorage.clear()
                }

                this.props.onRememberSession(response.data)

                setTimeout(()=>{
                    this.setState({loading: false})
                }, 100)

            }).catch((error)=>{
                return error
            })
        }
        else{
            this.setState({signedin: false, loading: false})
        }
    }

    onInit(){
        if(this.state.loading){
            return <Loading />
        }
        else if(this.props.auth.signedin){
            return <Menu auth={this.props.auth} />
        }
        else{
            return <Auth />
        }
    }

    render() {
        return(<div>{this.onInit()}</div>)
    }
}


const mapDispatchToProps = (dispatch) => {
  return {
    onRememberSession: (bool) => dispatch({
        type: 'onRememberSession',
        payload: bool
    })
  }
}

const mapStateToProps = (state) => ({
    auth:state.auth
})

export default connect(mapStateToProps, mapDispatchToProps)(HiNode)
