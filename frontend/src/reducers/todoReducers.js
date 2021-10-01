import {
    TODO_ADD_REQUEST,
    TODO_ADD_SUCCESS,
    TODO_ADD_FAIL,
    TODO_ADD_RESET,
    TODO_GET_REQUEST,
    TODO_GET_SUCCESS,
    TODO_GET_FAIL,
    TODO_GET_RESET,
    TODO_GET_ALL_REQUEST,
    TODO_GET_ALL_SUCCESS,
    TODO_GET_ALL_FAIL,
    TODO_GET_ALL_RESET,
    TODO_EDIT_REQUEST,
    TODO_EDIT_SUCCESS,
    TODO_EDIT_FAIL,
    TODO_EDIT_RESET,
    TODO_MARK_AS_DONE_REQUEST,
    TODO_MARK_AS_DONE_SUCCESS,
    TODO_MARK_AS_DONE_FAIL,
    TODO_MARK_AS_DONE_RESET,
    TODO_DELETE_REQUEST,
    TODO_DELETE_SUCCESS,
    TODO_DELETE_FAIL,
    TODO_DELETE_RESET,
} from '../constants/todoConstants';

export const todoAddReducer = (state = {}, action) => {
    switch (action.type) {
        case TODO_ADD_REQUEST:
            return { loading: true };
        case TODO_ADD_SUCCESS:
            return { loading: false, success: true };
        case TODO_ADD_FAIL:
            return { loading: false, error: action.payload };
        case TODO_ADD_RESET:
            return {};
        default:
            return state;
    }
};

export const todoGetReducer = (state = {}, action) => {
    switch (action.type) {
        case TODO_GET_REQUEST:
            return { loading: true };
        case TODO_GET_SUCCESS:
            return { loading: false, todo: action.payload };
        case TODO_GET_FAIL:
            return { loading: false, error: action.payload };
        case TODO_GET_RESET:
            return {};
        default:
            return state;
    }
};

export const todoGetAllReducer = (state = {}, action) => {
    switch (action.type) {
        case TODO_GET_ALL_REQUEST:
            return { loading: true };
        case TODO_GET_ALL_SUCCESS:
            return { loading: false, todos: action.payload };
        case TODO_GET_ALL_FAIL:
            return { loading: false, error: action.payload };
        case TODO_GET_ALL_RESET:
            return {};
        default:
            return state;
    }
};

export const todoEditReducer = (state = {}, action) => {
    switch (action.type) {
        case TODO_EDIT_REQUEST:
            return { loading: true };
        case TODO_EDIT_SUCCESS:
            return { loading: false, success: true };
        case TODO_EDIT_FAIL:
            return { loading: false, error: action.payload };
        case TODO_EDIT_RESET:
            return {};
        default:
            return state;
    }
};

export const todoMarkAsDoneReducer = (state = {}, action) => {
    switch (action.type) {
        case TODO_MARK_AS_DONE_REQUEST:
            return { loading: true };
        case TODO_MARK_AS_DONE_SUCCESS:
            return { loading: false, success: true };
        case TODO_MARK_AS_DONE_FAIL:
            return { loading: false, error: action.payload };
        case TODO_MARK_AS_DONE_RESET:
            return {};
        default:
            return state;
    }
};

export const todoDeleteReducer = (state = {}, action) => {
    switch (action.type) {
        case TODO_DELETE_REQUEST:
            return { loading: true };
        case TODO_DELETE_SUCCESS:
            return { loading: false, success: true };
        case TODO_DELETE_FAIL:
            return { loading: false, error: action.payload };
        case TODO_DELETE_RESET:
            return {};
        default:
            return state;
    }
};
