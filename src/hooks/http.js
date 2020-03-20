import {useReducer, useCallback} from 'react';

const initialState = {
    loading: false, 
    error: null, 
    data: null,
    extra: null,
    id: null
};

const httpReducer = (currentHttpState, action) => {
    switch(action.type) {
        case 'SEND': return {loading: true, error: null, data: null, extra: action.extra, id: action.id}
        case 'RESPONSE': return {...currentHttpState, loading: false, data: action.responseData, id: action.id, extra: action.extra}
        case 'ERROR': return {loading: false, error: action.error, data: null}
        case 'RESET_ERROR': return initialState
        default: throw new Error('Invalid action type')
    }
}
  
const useHttp = () => {
    const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);

    const sendRequest = useCallback((url, method='GET', body=null, extra=null, id=null) => {
        dispatchHttp({type: 'SEND', id: id, extra: extra});
        
        fetch(url, {method: method, body: body, headers: {'Content-Type': 'application/json'}})
        .then(response => {
            return response.json();
        })
        .then(responseData => {
            console.log(extra);
            console.log(responseData);
            console.log(id);
            dispatchHttp({type: 'RESPONSE', responseData: responseData, extra: extra, id: id});
        })
        .catch(error => {
            dispatchHttp({type: 'ERROR', error: error.message});
        })
    }, []);

    const resetError = useCallback(() => dispatchHttp({type: 'RESET_ERROR'}), []);

    return {
        isLoading: httpState.loading,
        data: httpState.data,
        error: httpState.error,
        extra: httpState.extra,
        id: httpState.id,
        sendRequest: sendRequest,
        resetError: resetError
    };
}

export default useHttp;