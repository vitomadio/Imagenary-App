import {
	SET_USERS,
	SET_USER,
	SET_CONTACT,
	SET_FOLLOW,
	SET_FOLLOWS_ME,
	SET_REQUEST_CONTACT_INFO,
	SET_INVITED_TO_STORE,
	REMOVE_FOLLOWED,
	ON_REMOVED_REQUEST,
	ON_REMOVED_FOLLOWER,
	ON_ADD_FOLLOWED,
	ON_GET_ACTIVITIES,
	ON_GET_FOLLOWED_LIKES,
} from './actionsTypes';
import { getPosts, getMyPosts, getMyPostsComments, uiStartLoading, uiStopLoading } from '../actions';
import firebase from 'react-native-firebase';
import Firebase from 'firebase';

const db = firebase.database();

//Get all users
export const getUsers = () => {
	return dispatch => {
		db.ref('/users').on('value', (snapshots) => {
			let users = [];
			snapshots.forEach(snapshot => {
				users.push({
					email: snapshot.val().email,
					username: snapshot.val().username,
					avatar: snapshot.val().avatar,
					key: snapshot.key,
					invitations: snapshot.val().invitations ? Object.values(snapshot.val().invitations) : [],
					requests: snapshot.val().requests ? Object.values(snapshot.val().requests) : [],
					comments: snapshot.val().comments ? Object.values(snapshot.val().comments) : []
				})
			})
			dispatch(setUsers(users));
		})
	};
};
//Set post in store.
export const setUsers = users => {
	return {
		type: SET_USERS,
		payload: users
	};
};
//Fetch session user.
export const getSessionUser = userId => {
	return dispatch => {
		db.ref('/users/' + userId).on('value', (snapshot) => {
			let user = {
				email: snapshot.val().email,
				username: snapshot.val().username,
				avatar: snapshot.val().avatar,
				key: snapshot.key,
				invitations: snapshot.val().invitations ? Object.values(snapshot.val().invitations) : [],
				requests: snapshot.val().requests ? Object.values(snapshot.val().requests) : [],
				follow: snapshot.val().follow ? Object.values(snapshot.val().follow) : [],
				followsMe: snapshot.val().followsMe ? Object.values(snapshot.val().followsMe) : [],
				likes: snapshot.val().likes ? Object.values(snapshot.val().likes) : [],
				chats: snapshot.val().chats ? Object.keys(snapshot.val().chats) : [],
				comments: snapshot.val().comments ? Object.keys(snapshot.val().comments) : [],
				imagePath: snapshot.val().imagePath ? snapshot.val().imagePath : null,
				savedElements: snapshot.val().savedElements ? Object.values(snapshot.val().savedElements) : []
			}
			dispatch(setUser(user));
			dispatch(getInvitedInfo(userId));
			dispatch(getRequestsInfo(null, userId));
			dispatch(getMyPostsComments(user.comments, userId));
			dispatch(getFollowedLikes(user.followsMe))
			dispatch(getMyPosts(user));
		});
		//Removes followed from store after being unfollowed.
		db.ref('/users/' + userId + '/follow').on("child_removed", snapshot => {
			db.ref('/users/' + snapshot.key).once('value')
				.then(snap => {
					const user = { ...snap.val(), key: snap.key };
					dispatch(removeFollowedFromStore(user))
					dispatch(removeFollowerFromStore(user))
					
				})
		});
		//Reset followedLikes on store after post has been removed.
		db.ref('/users/' + userId + '/followsMe').on("child_removed", snapshot => {
			db.ref('/users/' + snapshot.key).once('value')
				.then(snap => {
					const user = { ...snap.val(), key: snap.key };
					dispatch(getFollowedLikes(user.followsMe))
				})
		});
	};
};
//Set user in store
export const setUser = user => {
	return {
		type: SET_USER,
		user: user
	};
};
export const getContacts = (userId) => {
	return dispatch => {
		db.ref('/users/' + userId).once('value')
			.then(snapshot => {
				const response = {
					follow: snapshot.val().follow ? Object.values(snapshot.val().follow) : [],
					followsMe: snapshot.val().followsMe ? Object.values(snapshot.val().followsMe) : []
				}
				return response
			})
			.then(response => {
				const followList = [];
				response.follow.forEach(followed => {
					db.ref('/users/' + followed.key).once('value')
						.then(res => {
							followList.push({ ...res.val(), key: res.key });
							return followList
						})
						.then(response => {
							dispatch(setFollow(response))
							dispatch(getFollowedActivities(response))
						})
				})
				if (response.followsMe !== null) {
					const followsMeList = [];
					response.followsMe.forEach(follower => {
						db.ref('/users/' + follower.key).once('value')
							.then(res => {
								followsMeList.push({ ...res.val(), key: res.key });
								return followsMeList;
							})
							.then(response => {
								dispatch(setFollowsMe(response));
							})
					})
				}
			});
	};
};
//Set people i follow to store
const setFollow = (follow) => {
	return {
		type: SET_FOLLOW,
		payload: follow
	};
};
//Set followers in store
const setFollowsMe = (followsMe) => {
	return {
		type: SET_FOLLOWS_ME,
		payload: followsMe
	};
};
//Get followed start to follow activity.
const getFollowedActivities = (follow) => {
	return dispatch => {
		const activities = [];
		follow.forEach(followed => {
			db.ref('/users/' + followed.key + '/follow').once('value')
				.then(snap => {
					snap.forEach(item => {
						db.ref('/users/' + item.key).once('value')
							.then(snapshot => {
								activities.push({ date: item.val().date, followed, follows: { ...snapshot.val(), key: snapshot.key } });
								return activities;
							})
							.then(response => {
								dispatch(setStartsToFollow(response));
							})
					})
				})
		})

	}
}
//Set starts to follows activities to store.
const setStartsToFollow = (activities) => {
	return {
		type: ON_GET_ACTIVITIES,
		payload: activities
	}
}
/*Get Followed likes activity.
followsMe only has userKey and date when he started to follows me.
*/
const getFollowedLikes = (followsMe) => {
	return dispatch => {
		const activities = [];
		followsMe.forEach(follower => {
			db.ref('/users/'+follower.key).once('value')
			.then(snap => {
				if (snap.val().likes) {
					Object.values(snap.val().likes).forEach(like => {
						db.ref('/posts/' + like.post).once('value')
							.then(snapshot => {
								const followed = {...snap.val(),key:snap.key}
								activities.push({ date: like.date, followed, post: { ...snapshot.val(), key: snapshot.key }, event: 'like' });
								return activities;
							})
							.then(response => {
								dispatch(setFollowedLikesPostToStore(response));
							})
					})
				}
			})
		})
	}
}
//Set starts to follows activities to store.
const setFollowedLikesPostToStore = (followedLikes) => {
	return {
		type: ON_GET_FOLLOWED_LIKES,
		payload: followedLikes
	}
}
//Get contact info of follow requests
export const getRequestsInfo = (sessionUser, userId) => {
	return dispatch => {
		if (sessionUser !== null) {
			db.ref('/users/' + sessionUser.key + '/requests').once('value', snapshot => {
				snapshot.forEach(request => {
					if (request.val().active === false) {
						return db.ref('/users/' + request.key).once('value', snap => {
							dispatch(setRequests({ ...snap.val(), key: request.key }))
						})
					}
				})
			})
		} else {
			db.ref('/users/' + userId + '/requests').once('value', snapshot => {
				snapshot.forEach(request => {
					if (request.val().active === false) {
						return db.ref('/users/' + request.key).once('value', snap => {
							dispatch(setRequests({ ...snap.val(), key: request.key }))
						})
					}
				})
			})
		}
	};
};
//Set requests users to store
const setRequests = (contact) => {
	return {
		type: SET_REQUEST_CONTACT_INFO,
		payload: contact
	};
};
//Get invited users info.
export const getInvitedInfo = (userId) => {
	return dispatch => {
		db.ref('/users/' + userId + '/invitations').once('value', snapshot => {
			snapshot.forEach(invitation => {
				return db.ref('/users/' + invitation.key).once('value', snap => {
					dispatch(setInvited(snap.val()));
				})
			})
		})
	};
};
//Set Invited to store.
const setInvited = (invited) => {
	return {
		type: SET_INVITED_TO_STORE,
		payload: invited
	}
}
//Get user promise.
export const getUserPromise = contactId => {
	return dispatch => {
		return db.ref('/users/' + contactId).once('value', snapshot => {
			return snapshot.val().username;
		})
	}
}
//Get specific user or contact
export const getUser = contactId => {
	return dispatch => {
		db.ref('/users/' + contactId).on('value', (snapshot) => {
			let contact = {
				email: snapshot.val().email,
				username: snapshot.val().username,
				avatar: snapshot.val().avatar,
				key: snapshot.key,
				invitations: snapshot.val().invitations ? Object.values(snapshot.val().invitations) : [],
				requests: snapshot.val().requests ? Object.values(snapshot.val().requests) : [],
				follow: snapshot.val().follow ? Object.values(snapshot.val().follow) : [],
				followsMe: snapshot.val().followsMe ? Object.values(snapshot.val().followsMe) : [],
				comments: snapshot.val().comments ? Object.values(snapshot.val().comments) : []
			}
			dispatch(setContact(contact));
		});
	};
};
//Set contact in store
export const setContact = contact => {
	return {
		type: SET_CONTACT,
		contact: contact
	};
};
//Sends invitation to user.
export const sendInvitation = (userInvited, sessionUser) => {
	return dispatch => {
		db.ref('/users/' + userInvited.key + '/requests/' + sessionUser.key).set({
			key: sessionUser.key,
			active: false,
			date: Firebase.database.ServerValue.TIMESTAMP
		});
		db.ref('/users/' + sessionUser.key + '/invitations/' + userInvited.key).set({
			active: false,
			key: userInvited.key,
			date: Firebase.database.ServerValue.TIMESTAMP
		});

	};
};
//Remove invitation to user.
export const removeInvitation = (userInvited, sessionUser) => {
	return dispatch => {
		db.ref('/users/' + userInvited.key + '/requests/' + sessionUser.key).once('value', snapshot => {
			if (snapshot.val()) {
				db.ref('/users/' + userInvited.key + '/requests/' + sessionUser.key).remove();
			}
		})
		db.ref('/users/' + sessionUser.key + '/invitations/' + userInvited.key).remove();
	};
};

//Accepts someone's invitation and let him or her starts to follow you.
export const acceptInvitation = (userRequest, sessionUser) => {
	return dispatch => {
		db.ref('/users/' + sessionUser.key + '/requests/' + userRequest.key).remove();
		db.ref('/users/' + userRequest.key + '/invitations/' + sessionUser.key).remove();

		db.ref('/users/' + sessionUser.key + '/followsMe/' + userRequest.key).set({
			key: userRequest.key,
			date: Firebase.database.ServerValue.TIMESTAMP
		});
		db.ref('/users/' + sessionUser.key + '/follow/' + userRequest.key).set({
			key: userRequest.key,
			date: Firebase.database.ServerValue.TIMESTAMP
		});
		db.ref('/users/' + userRequest.key + '/follow/' + sessionUser.key).set({
			key: sessionUser.key,
			date: Firebase.database.ServerValue.TIMESTAMP
		});
		db.ref('/users/' + userRequest.key + '/followsMe/' + sessionUser.key).set({
			key: sessionUser.key,
			date: Firebase.database.ServerValue.TIMESTAMP
		});
		dispatch(getPosts());
		dispatch(removeRequestFromStore(userRequest));
		dispatch(addFollowedToStore(userRequest));
	};
};
//Reject invitation...
export const rejectRequest = (userRequest, sessionUser) => {
	return dispatch => {
		db.ref('/users/' + sessionUser.key + '/requests/' + userRequest.key).remove();
		dispatch(removeRequestFromStore(userRequest))
	};
};
//Remove reuqest from store.
const removeRequestFromStore = (userRequest) => {
	return {
		type: ON_REMOVED_REQUEST,
		payload: userRequest
	}
}
//Start to follow someone of your followers...
export const startFollowing = (followUser, sessionUser) => {
	return dispatch => {
		db.ref('/users/' + sessionUser.key + '/follow/' + followUser.key).set({
			key: followUser.key,
			date: Firebase.database.ServerValue.TIMESTAMP
		});
		dispatch(getPosts());
		dispatch(addFollowedToStore(followUser));
	};
};
//Add new followed to store.
const addFollowedToStore = (followedUser) => {
	return {
		type: ON_ADD_FOLLOWED,
		payload: followedUser
	};
};
//Stop following specific user.
export const stopFollowing = (sessionUser, followedUser) => {
	return dispatch => {
		db.ref('/users/' + sessionUser.key + '/follow/' + followedUser.key).remove();
		// dispatch(removeFollowedFromStore(followedUser));
	};
};
//Remove follower from store.
const removeFollowedFromStore = (followedUser) => {
	return {
		type: REMOVE_FOLLOWED,
		payload: followedUser
	};
};
//Remove from followers, this actions completely removes follower and prevent him to follows you.
export const removeFollower = (removeUser, sessionUser) => {
	return dispatch => {
		db.ref('/users/' + sessionUser.key + '/follow/' + removeUser.key).remove();
		db.ref('/users/' + removeUser.key + '/followsMe/' + sessionUser.key).remove();
		db.ref('/users/' + removeUser.key + '/follow/' + sessionUser.key).remove();
		db.ref('/users/' + sessionUser.key + '/followsMe/' + removeUser.key).remove();
		dispatch(removeFollowerFromStore(removeUser))
	};
};
//Remove follower from store.
const removeFollowerFromStore = (removeUser) => {
	return {
		type: ON_REMOVED_FOLLOWER,
		payload: removeUser
	};
};
//Change Avatar Picture
export const changeAvatarImage = (sessionUser, image) => {
	return dispatch => {
		dispatch(uiStartLoading())
		fetch("https://us-central1-instalike-1de92.cloudfunctions.net/storeAvatar", {
			method: "PATCH",
			body: JSON.stringify({
				image: image.base64,
				imagePath: sessionUser.imagePath ? sessionUser.imagePath : null
			})
		})
			.catch(err => console.log(err))
			.then(res => {
				if (res.ok) {
					return res.json();
				} else {
					throw new Error();
				}
			})
			.then(parsedRes => {
				db.ref('/users/' + sessionUser.key).update({
					avatar: parsedRes.imageUrl,
					imagePath: parsedRes.imagePath
				})
					.then(() => {
						dispatch(getSessionUser(sessionUser.key));
						dispatch(uiStopLoading());
					})
			});
	};
};
//Delete Avatar.
export const deleteAvatar = sessionUser => {
	return dispatch => {
		if (sessionUser.imagePath) {
			fetch("https://instalike-1de92.appspot.com" + sessionUser.imagePath, {
				method: "DELETE"
			})
				.then(res => res.json())
				.then(parsedRes => {
					console.log(JSON.stringify(parsedRes))
				})
				.catch(err => console.log("Error " + err))
		};
	};
};
//Save Post in saved elements.
export const savePost = (post, sessionUser) => {
	return dispatch => {
		db.ref('/users/' + sessionUser.key + '/savedElements/' + post.key).set({
			_uid: post.key,
			post: post
		});
	};
};






