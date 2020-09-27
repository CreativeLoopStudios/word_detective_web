import React, { useReducer, useEffect } from 'react';
import { SET_PLAYER_NAME, SET_HEARTBEAT_DATA } from '../../actions';
import { v4 as uuidv4 } from 'uuid';
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';

const SessionContext = React.createContext();

const initialState = {
    playerName: null,
    playerId: null,
    heartbeatData: null,
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

const generateUserName = () => {
    return uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals], separator: ' ', style: 'capital' });
}

const SessionContextProvider = (props) => {
    const localState = JSON.parse(localStorage.getItem("SessionContext")) || initialState;
    if (localState.playerId === undefined || localState.playerId === null) {
        localState.playerId = uuidv4();
    }
    if (!localState.playerName) {
        localState.playerName = generateUserName();
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