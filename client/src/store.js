import { createStore, applyMiddleware, compose} from 'redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk';
import rootReducer from './reducers'

function getInitialStateCheckingStorage(){

    let initialState = {
        auth: {
            signedin: false,
            user: null,
            render: 'signin',
            error:{
                signin: [],
                signup: []
            }
        }
    }

    if(JSON.parse(sessionStorage.getItem('auth')) !== null){
        let auth_SessionStorage = JSON.parse(sessionStorage.getItem('auth'))
        return Object.assign({}, initialState, {auth: auth_SessionStorage})
    }
    else if(JSON.parse(localStorage.getItem('auth')) !== null) {
        let auth_LocalStorage = JSON.parse(localStorage.getItem('auth'))
        return Object.assign({}, initialState, {auth: auth_LocalStorage})
    }else{
        return initialState
    }
}

const store = createStore(
    rootReducer,
    getInitialStateCheckingStorage(),
    compose(
        applyMiddleware(logger, thunk),
        window.devToolsExtension ? window.devToolsExtension() : f => f
    )
)

export default store
