import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import { userLoginReducer, userRegisterReducer, userGetProfileReducer, userUpdateReducer } from './reducers/userReducers';
import {
    todoAddReducer,
    todoDeleteReducer,
    todoEditReducer,
    todoMarkAsDoneReducer,
    todoGetAllReducer,
    todoGetReducer,
} from './reducers/todoReducers';

const reducer = combineReducers({
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userGetProfile: userGetProfileReducer,
    userUpdate: userUpdateReducer,
    todoAdd: todoAddReducer,
    todoGet: todoGetReducer,
    todoGetAll: todoGetAllReducer,
    todoEdit: todoEditReducer,
    todoMarkAsDone: todoMarkAsDoneReducer,
    todoDelete: todoDeleteReducer,
});

const middleware = [thunk];

const userInfoFromStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

const initialState = {
    userLogin: { userInfo: userInfoFromStorage },
};

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));

export default store;
