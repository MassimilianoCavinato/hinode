import React from 'react'
import Helmet from 'react-helmet'

class Home extends React.Component{

    render(){
        return(
            <div>
                <Helmet>
                    <style>{'body{background-image: url(https://i.ytimg.com/vi/o6iUaL8BUN4/maxresdefault.jpg); background-size: cover; background-repeat: no-repeat;}'}</style>
                </Helmet>
            </div>
        )
    }
}

export default Home
