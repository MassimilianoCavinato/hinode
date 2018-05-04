export default function authReducer(state = null, { type, payload }){

    switch(type){

        case 'onSignin':

            if(payload.ok){
                sessionStorage.setItem('auth', JSON.stringify(payload.response))
                if(payload.remember){
                    localStorage.setItem('auth', JSON.stringify(payload.response))
                }
                return Object.assign({}, state, payload.response, {signedin: true})
            }
            else{
                sessionStorage.clear()
                localStorage.clear()
                return Object.assign({}, state, payload.response, {signedin: false})
            }

        case 'onSignup':
            console.log('SIGNUP REDUCER', payload)

            if(payload.ok){
                sessionStorage.setItem('auth', JSON.stringify(payload.response))
                return Object.assign({}, state, payload.response, {signedin: true})
            }else{
                sessionStorage.clear()
                localStorage.clear()
                return Object.assign({}, state, payload.response, {signedin: false})
            }

        case 'onSignout':
            localStorage.clear()
            sessionStorage.clear()
            return Object.assign({}, state, payload)

        case 'showSignup':
            return Object.assign({}, state, payload)

        case 'showSignin':
            return Object.assign({}, state, payload)

        case 'onRememberSession':
            return Object.assign({}, state, {signedin: payload})

        default:
            return state
    }

}
