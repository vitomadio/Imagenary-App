import {
    ON_CHAT_GOT,
	CHAT_DELETED,
	SET_READ_MESSAGE,
	REMOVE_NOT_READ_MESSAGE,
    ON_PREVIOUS_MESSAGES
} from '../actions/actionsTypes';
import firebase from 'react-native-firebase';
import Firebase from 'firebase';

const db = firebase.database();

//Send a chat message.
export const addChat = (message, sessionUser, recipient) => {
	return dispatch => {
		const chatKeySender = db.ref('/users/' + sessionUser.key + '/chats/' + recipient.key).push().key;
		const chatKeyRecipient = db.ref('/users/' + recipient.key + '/chats/' + sessionUser.key).push().key;
		db.ref('/users/' + sessionUser.key + '/chats/' + recipient.key).child(chatKeySender).set({
			chatWith: recipient.key,
			sender: sessionUser.key,
			recipient: recipient.key,
			message: message,
			date: Firebase.database.ServerValue.TIMESTAMP,
			key: chatKeySender
		});
		db.ref('/users/' + recipient.key + '/chats/' + sessionUser.key).child(chatKeyRecipient).set({
			chatWith: sessionUser.key,
			recipient: recipient.key,
			sender: sessionUser.key,
			message: message,
			date: Firebase.database.ServerValue.TIMESTAMP,
			read: false,
			key: chatKeyRecipient
		});
	};
};
//Share post with another user through chat.
export const sendPost = (message, post, sessionUser, recipient) => {
	return dispatch => {
		const chatKeySender = db.ref('/users/' + sessionUser.key + '/chats/' + recipient.key).push().key;
		const chatKeyRecipient = db.ref('/users/' + recipient.key + '/chats/' + sessionUser.key).push().key;
		db.ref('/users/' + sessionUser.key + '/chats/' + recipient.key).child(chatKeySender).set({
			chatWith: recipient.key,
			sender: sessionUser.key,
			recipient: recipient.key,
			message: message,
			date: Firebase.database.ServerValue.TIMESTAMP,
			key: chatKeySender,
			post: post
		});
		db.ref('/users/' + recipient.key + '/chats/' + sessionUser.key).child(chatKeyRecipient).set({
			chatWith: sessionUser.key,
			recipient: recipient.key,
			sender: sessionUser.key,
			message: message,
			date: Firebase.database.ServerValue.TIMESTAMP,
			read: false,
			key: chatKeyRecipient,
			post: post
		});
		const chat = {
			chatWith: recipient.key,
			sender: sessionUser.key,
			recipient: recipient.key,
			message: message,
			date: Firebase.database.ServerValue.TIMESTAMP,
			key: chatKeySender,
			post: post
		}
	};
};
//Fetch not readed message.
export const fetchNotReadedMessage = (sessionUser) => {
	return async dispatch => {
		const result = await db.ref('/users/' + sessionUser.key + '/chats/').on('value', snapshot => {
			snapshot.forEach(chat => {
				chat.forEach(message => {
					if (message.val().read == false) {
						dispatch(setNotReadMessage(chat.key));
					}
				});
			});
		});
		return result;
	};
};
//Change chat read to true.
const changeToReadMessage = (sessionUser, key, recipient) => {
	return dispatch => {
		db.ref('/users/' + sessionUser.key + '/chats/' + recipient.key).child(key).update({ read: true });
		dispatch(removeNotReadMessage(recipient.key))
	};
};
//Set read message to store.
const setNotReadMessage = (key) => {
	return {
		type: SET_READ_MESSAGE,
		payload: key
	};
};
//Remove read message from store.
const removeNotReadMessage = (key) => {
	return {
		type: REMOVE_NOT_READ_MESSAGE,
		payload: key
	};
};
//Fetch Chat.
export const getChat = (sessionUser, recipient) => {
	return dispatch => {
		db.ref('/users/' + sessionUser.key + '/chats/' + recipient.key).once('value')
			.then(snap => {
				if (snap.val() !== null) {
					db.ref('/users/' + sessionUser.key + '/chats/' + recipient.key).limitToLast(10).on('child_added', snapshot => {
						if (snapshot.val().read === false) {
							dispatch(changeToReadMessage(sessionUser, snapshot.key, recipient));
						} else {
							dispatch(removeNotReadMessage(null))
						}
						dispatch(setChat(snapshot.val()));
					});
				} else {
					db.ref('/users/' + sessionUser.key + '/chats/' + recipient.key).limitToLast(10).on('child_added', snapshot => {
						dispatch(setChat(snapshot.val()));
					})
				}
			})
			.catch(err => console.log(err))
	};
};
//Fetch chats by 10 to 10
export const fetchMessagesByTen = (sessionUser, recipient, previousMessageKey) => {
	return dispatch => {
		return db.ref('/users/' + sessionUser.key + '/chats/' + recipient.key).orderByKey().endAt(previousMessageKey).limitToLast(10).once('value')
			.then(snapshot => {
				const list = []
				snapshot.forEach(message => {
					if (message.key !== previousMessageKey) {
						list.push(message.val())
					}
				});
				dispatch(setPreviousMessages(list));
			})
			.catch(err => console.log(err));
	};
};
//Set chat into store.
const setChat = (chat) => {
	return {
		type: ON_CHAT_GOT,
		payload: chat
	};
};
//Set previous 10 message to store.
const setPreviousMessages = messagesList => {
	return {
		type: ON_PREVIOUS_MESSAGES,
		payload: messagesList
	};
};
//Delete chat from DB.
export const deleteChat = (sessionUser, recipientKey) => {
	return dispatch => {
		db.ref('/users/' + sessionUser.key + '/chats/' + recipientKey).remove();
		dispatch(deleteChatFromStore(recipientKey));
	};
};
//Remove chat from store.
const deleteChatFromStore = (recipientKey) => {
	return {
		type: CHAT_DELETED,
		payload: recipientKey
	};
};