import {
    ON_CHAT_GOT,
	CHAT_DELETED,
	SET_READ_MESSAGE,
	REMOVE_NOT_READ_MESSAGE,
    ON_PREVIOUS_MESSAGES
} from '../actions/actionsTypes';

const initialState = {
    chat:[],
	notReadMessages: []
}

const reducer = (state = initialState, action) => {
    switch(action.type){
        //On write chat
        case ON_CHAT_GOT:
		if(action.payload === 'array'){ //if ther was no chat yet.
			return {
				...state,
			}
		}else{ //If ther's a chat already.
			if(state.chat.length >= 1){
				if(state.chat.filter(item => item.key === action.payload.key).length >= 1 ){
					return {
						...state,
						chat: state.chat
					}
				}else{
					return {
						...state,
						chat: [...state.chat.filter(item => item.chatWith === action.payload.chatWith), action.payload]
					}
				}
			}else{
				return {
					...state,
					chat:[action.payload]
				}
			}
		}
        //Get 10 previous chat messages.
		case ON_PREVIOUS_MESSAGES:
		return {
			...state, 
			chat: [...action.payload, ...state.chat]
		}
        //Set message to read = true when it is read.
		case SET_READ_MESSAGE:
		if(state.notReadMessages.filter(item => item === action.payload).length >= 1){
			return {
				...state,
				notReadMessages: state.notReadMessages
			}
		}else{
			return {
				...state, 
				notReadMessages: [...state.notReadMessages, action.payload]
			}
		}
        //Change all messages to read when open chat screen.
		case REMOVE_NOT_READ_MESSAGE: 
		if(action.payload === null){
			return {
				...state,
				notReadMessages: []
			}
		}else{
			return {
				...state,
				notReadMessages: state.notReadMessages.filter(key => key !== action.payload)
			}
		}
        //Delete chat.
		case CHAT_DELETED: 
		return {
			...state,
			chat:[]
		}
        default: 
        return state;
    }
};

export default reducer;