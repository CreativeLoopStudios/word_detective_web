import React, { useReducer, useEffect } from 'react';
import { SET_PLAYER_NAME, SET_HEARTBEAT_DATA } from '../../actions';
import { v4 as uuidv4 } from 'uuid';

const SessionContext = React.createContext();

const initialState = {
    playerName: null,
    playerId: uuidv4(),
};

const reducer = (state, action) => {
    switch (action.type) {
        case SET_PLAYER_NAME:
            return {
                ...state,
                playerName: action.payload
            }
        case SET_HEARTBEAT_DATA:
            return {
                ...state,
                heartbeatData: action.payload
            }
        default:
            throw new Error();
    }
};

const saveState = (state) => {
    localStorage.setItem("SessionContext", JSON.stringify(state));
}

const SessionContextProvider = (props) => {
    const localState = JSON.parse(localStorage.getItem("SessionContext")) || initialState;
    if (localState.playerId === undefined) {
        localState.playerId = uuidv4();
        saveState(localState);
    }

    const [state, dispatch] = useReducer(reducer, localState);
    useEffect(() => saveState(state), [state]);

    return (
        <SessionContext.Provider value={{ state, dispatch }}>
            {props.children}
        </SessionContext.Provider>
    );
};

export default SessionContext;

export { SessionContextProvider };