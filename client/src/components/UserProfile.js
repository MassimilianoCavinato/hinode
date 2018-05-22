import React from 'react'
import { connect } from 'react-redux'

class UserProfile extends React.Component{

    render(){
        return(
            <div className='container-fluid'>
                <div>

                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    auth:state.auth
})

export default connect(mapStateToProps)(UserProfile)
