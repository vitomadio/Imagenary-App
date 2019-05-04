import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import authReducer from './reducers/authReducer';
import postReducer from './reducers/postReducer';
import usersReducer from './reducers/usersReducer';
import uiReducer from './reducers/uiReducer';
import chatReducer from './reducers/chatReducer';

const rootReducer = combineReducers({
	auth: authReducer,
	post: postReducer,
	users: usersReducer,
	ui: uiReducer,
	chat: chatReducer
});

let composeEnhancers = compose;

if (__DEV__) {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
};

const configureStore = () => {
	return createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

};

export default configureStore;