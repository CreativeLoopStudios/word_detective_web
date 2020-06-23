import React, { useReducer } from 'react';
import { SET_PLAYER_NAME } from '../../actions';

const SessionContext = React.createContext();

const initialState = {
    playerName: ''
};

const reducer = (state, action) => {
    switch (action.type) {
        case SET_PLAYER_NAME:
            return {
                ...state,
                playerName: action.payload
            }
        default:
            throw new Error();
    }
};

const SessionContextProvider = (props) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <SessionContext.Provider value={{ state, dispatch }}>
            {props.children}
        </SessionContext.Provider>
    );
};

export default SessionContext;

export { SessionContextProvider };