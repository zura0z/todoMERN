import axios from 'axios';
import {
    TODO_ADD_REQUEST,
    TODO_ADD_SUCCESS,
    TODO_ADD_FAIL,
    TODO_GET_REQUEST,
    TODO_GET_SUCCESS,
    TODO_GET_FAIL,
    TODO_GET_ALL_REQUEST,
    TODO_GET_ALL_SUCCESS,
    TODO_GET_ALL_FAIL,
    TODO_EDIT_REQUEST,
    TODO_EDIT_SUCCESS,
    TODO_EDIT_FAIL,
    TODO_MARK_AS_DONE_REQUEST,
    TODO_MARK_AS_DONE_SUCCESS,
    TODO_MARK_AS_DONE_FAIL,
    TODO_DELETE_REQUEST,
    TODO_DELETE_SUCCESS,
    TODO_DELETE_FAIL,
} from '../constants/todoConstants';

export const addTodo = (name, comment, deadline, status) => async (dispatch, getState) => {
    try {
        dispatch({ type: TODO_ADD_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.post('/api/todo', { name, comment, deadline, status }, config);

        dispatch({ type: TODO_ADD_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: TODO_ADD_FAIL,
            payload: error?.response?.data?.message || error?.message,
        });
    }
};

export const getTodo = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: TODO_GET_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.get(`/api/todo/${id}`, config);

        dispatch({ type: TODO_GET_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: TODO_GET_FAIL,
            payload: error?.response?.data?.message || error?.message,
        });
    }
};

export const getAllTodos =
    (keyword = '') =>
    async (dispatch, getState) => {
        try {
            dispatch({ type: TODO_GET_ALL_REQUEST });

            const {
                userLogin: { userInfo },
            } = getState();

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.get(`/api/todo/all?keyword=${keyword}`, config);

            dispatch({ type: TODO_GET_ALL_SUCCESS, payload: data.todos });
        } catch (error) {
            dispatch({
                type: TODO_GET_ALL_FAIL,
                payload: error?.response?.data?.message || error?.message,
            });
        }
    };

export const editTodo = (todo) => async (dispatch, getState) => {
    try {
        dispatch({ type: TODO_EDIT_REQUEST });

        const { name, comment, deadline, status, _id } = todo;

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.put(`/api/todo/${_id}`, { name, comment, deadline, status }, config);

        dispatch({ type: TODO_EDIT_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: TODO_EDIT_FAIL,
            payload: error?.response?.data?.message || error?.message,
        });
    }
};

export const doneTodo = (_id) => async (dispatch, getState) => {
    try {
        dispatch({ type: TODO_MARK_AS_DONE_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.put('/api/todo', { _id }, config);

        dispatch({ type: TODO_MARK_AS_DONE_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: TODO_MARK_AS_DONE_FAIL,
            payload: error?.response?.data?.message || error?.message,
        });
    }
};

export const deleteTodo = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: TODO_DELETE_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.delete(`/api/todo/${id}`, config);

        dispatch({ type: TODO_DELETE_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: TODO_DELETE_FAIL,
            payload: error?.response?.data?.message || error?.message,
        });
    }
};
