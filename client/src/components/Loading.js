import React from 'react'
import Helmet from 'react-helmet'
class Loading extends React.Component{

    render(){
        return(
            <Helmet>
                <style>{"body{background-image: url(https://cdn.dribbble.com/users/108183/screenshots/2389529/likeapreloader.gif); background-size: cover; background-repeat: no-repeat;}"}</style>
            </Helmet>
        )
    }
}

export default Loading
