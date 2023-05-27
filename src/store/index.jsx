import { createStore } from 'redux'

const INITIAL_STATE = {
    isEndSession: false,
};

const ACTIONS = {
    SET_IS_END_SESSION: 'SET_IS_END_SESSION',
};

const setState = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ACTIONS.SET_IS_END_SESSION:
            return { ...state, isEndSession: action.data };
        default:
            return state;
    };
};

const store = createStore(setState);

export default store;

// -------------------------- ACTIONS AFTER HERE

export const setIsEndSession = (value) => {
    return { type: ACTIONS.SET_IS_END_SESSION, data: value };
};