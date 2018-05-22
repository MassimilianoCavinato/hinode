import React from 'react'
import ReactDOM from 'react-dom'
import './css/index.scss'

import HiNode from './components/HiNode'
import { Provider } from 'react-redux'
import store from './store'

ReactDOM.render(
    <Provider store={store}>
        <HiNode />
    </Provider>,
    document.getElementById('root')
)
