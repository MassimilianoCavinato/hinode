import React from 'react'
import { connect } from 'react-redux'

class UserProfile extends React.Component{

    render(){
        return(
            <div className='container-fluid'>
                <p className='green'>test 1</p>
                <div id='test'>
                    <p>test2</p>

                    <p className='green'>test3</p>

                    <p className=''>test4</p>

                    <p className=''>test5</p>
                    <b className='green'>test7</b>
                </div>
                <p className=''>test6</p>
                <b className='green'>test8</b>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    auth:state.auth
})

export default connect(mapStateToProps)(UserProfile)
