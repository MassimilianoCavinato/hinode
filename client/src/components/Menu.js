import React from 'react'
import { connect } from 'react-redux'
import { BrowserRouter, Route, Link} from 'react-router-dom'
import Home from './Home'
import UserProfile from './UserProfile'
import NetworkGraph from './NetworkGraph'
import NodeTemplate from './NodeTemplate'

class Menu extends React.Component{

    onSignout(e){
        this.props.onSignout()
    }

    render(){
        return(
            <BrowserRouter>
                <div style={{ display: "flex"}}>
                    <div id='menu-sidebar' style={{minHeight: '100vh'}}>
                        <ul style={{ listStyleType: "none", padding: 0 }}>
                            <li>
                                <Link to="/Profile">
                                    <button className='menu-button'>
                                        {this.props.auth.user.username}
                                    </button>
                                </Link>
                            </li>
                            <li>
                                <Link to="/">
                                    <button className='menu-button'>
                                        Home
                                    </button>
                                </Link>
                            </li>
                            <li>
                                <Link to="/NetworkGraph">
                                    <button className='menu-button'>
                                        Network
                                    </button>

                                </Link>
                                <Link to="/NodeTemplate">
                                    <button className='menu-button'>
                                        Templates
                                    </button>

                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div style={{width: '100%'}}>
                        <Route exact path='/Profile' component={UserProfile}/>
                        <Route exact path='/' component={Home}/>
                        <Route exact path='/NodeTemplate' component={NodeTemplate}/>
                        <Route exact path='/NetworkGraph' component={NetworkGraph}/>
                    </div>
                </div>
            </BrowserRouter>
        )
    }
}

const mapStateToProps = (state) => ({
    auth:state.auth,
})

const mapDispatchToProps = (dispatch) => {
  return {
    onSignout: () => dispatch({
        type: 'onSignout',
        payload: {
            signedin: false,
            user: null,
            render: "signin"
        }
    })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu)
