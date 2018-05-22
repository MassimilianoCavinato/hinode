import React from 'react'
import Signin from './Signin'
import Signup from './Signup'
import { Helmet } from 'react-helmet'
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
            <div id='auth'>
                <Helmet>
                    <title>Network Graph</title>
                    <style>{'body{background-image: url(https://d2v9y0dukr6mq2.cloudfront.net/video/thumbnail/TtcstKI/videoblocks-abstract-motion-background-digital-plexus-data-networks-alpha-matte-loop_bbfr_r-rew_thumbnail-full01.png);}'}</style>
                </Helmet>
                {this.renderAuth()}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    auth:state.auth,
})

export default connect(mapStateToProps)(Auth)
