import { createStore } from 'redux'

const INITIAL_STATE = {
    isEndSession: false,
    isLoggedUser: false,
    accessToken: "",
    refreshToken: "",
    userData: null,
    resAiCurrent: null,
    isTalking: false
};

const ACTIONS = {
    SET_IS_END_SESSION: 'SET_IS_END_SESSION',
    SET_IS_LOGGED_USER: 'SET_IS_LOGGED_USER',
    SET_ACCESS_TOKEN: 'SET_ACCESS_TOKEN',
    SET_REFRESH_TOKEN: 'SET_REFRESH_TOKE',
    SET_USER_DATA: 'SET_USER_DATA',
    SET_RES_AI_CURRENT: 'SET_RES_AI_CURRENT',
    SET_IS_TALKING: 'SET_IS_TALKING'
};

const setState = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ACTIONS.SET_IS_END_SESSION:
            return { ...state, isEndSession: action.data };
        case ACTIONS.SET_IS_LOGGED_USER:
            return { ...state, isLoggedUser: action.data };
        case ACTIONS.SET_ACCESS_TOKEN:
            return {...state, accessToken: action.data};
        case ACTIONS.SET_REFRESH_TOKEN:
            return {...state, refreshToken: action.data};
        case ACTIONS.SET_USER_DATA:
            return {...state, userData: action.data};
        case ACTIONS.SET_RES_AI_CURRENT:
            return {...state, resAiCurrent: action.data};
        case ACTIONS.SET_IS_TALKING:
            return {...state, isTalking: action.data};
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

export const setIsLoggedUser = (value) => {
    return { type: ACTIONS.SET_IS_LOGGED_USER, data: value };
};

export const setAccessToken = (value) => {
    return { type: ACTIONS.SET_ACCESS_TOKEN, data: value };
};

export const setRefreshToken = (value) => {
    return { type: ACTIONS.SET_REFRESH_TOKEN, data: value };
};

export const setUserData = (value) => {
    return { type: ACTIONS.SET_USER_DATA, data: value };
};

export const setResAiCurrent = (value) => {
    return { type: ACTIONS.SET_RES_AI_CURRENT, data: value };
};

export const setIsTalking = (value) => {
    return { type: ACTIONS.SET_IS_TALKING, data: value };
};