import { 
	SET_USERS,
	SET_USER,
	SET_FOLLOW,
	SET_FOLLOWS_ME,
	SET_CONTACT,
	SET_REQUEST_CONTACT_INFO,
	SET_INVITED_TO_STORE,
	REMOVE_FOLLOWED,
	ON_REMOVED_REQUEST,
	ON_REMOVED_FOLLOWER,
	ON_ADD_FOLLOWED,
	ON_GET_ACTIVITIES,
	ON_GET_FOLLOWED_LIKES,
	REMOVE_FOLLOWED_LIKE
} from '../actions/actionsTypes.js';

const initialState = {
	users: [],
	user: {},
	follow: [],
	followsMe: [],
	chat:[],
	notReadMessages: [],
	requests: [],
	invitations: [],
	followsActivities: [],
	followedLikes: []
}

const reducer = (state = initialState, action) => {
	switch(action.type){

		case SET_USERS: 
		return {
			...state,
			users: action.payload
		}

		case SET_USER: 
		return {
			...state,
			user: action.user
		}

		case SET_CONTACT: 
		return {
			...state,
			contact: action.contact
		}

		case SET_REQUEST_CONTACT_INFO: 
		return {
			...state,
			requests: [...state.requests.filter(request => request.key !== action.payload.key), action.payload]
		}

		case ON_REMOVED_REQUEST:
		return {
			...state,
			requests: state.requests.filter(request => request.key !== action.payload.key)
		}

		case SET_INVITED_TO_STORE:
		return {
			...state,
			invitations: [...state.invitations.filter(invitation => invitation.key !== action.payload.key), action.payload]
		}

		case SET_FOLLOW: 
		return {
			...state,
			follow: action.payload
		}

		case REMOVE_FOLLOWED: 
		return {
			...state,
			follow: state.follow.filter(followed => followed.key !== action.payload.key)
		}

		case SET_FOLLOWS_ME: 
		return {
			...state,
			followsMe: action.payload
		}

		case ON_ADD_FOLLOWED:
		return {
			...state,
			follow: [...state.follow, action.payload]
		}

		case ON_REMOVED_FOLLOWER: 
		return {
			...state,
			followsMe: state.followsMe.filter(follower => follower.key !== action.payload.key)
		}

		case ON_GET_ACTIVITIES:
		return {
			...state,
			followsActivities: action.payload
		}

		case ON_GET_FOLLOWED_LIKES:
		return {
			...state,
			followedLikes: action.payload
		}
		
		case REMOVE_FOLLOWED_LIKE: 
		const newFollowedLikes = state.followedLikes.filter(like => like.post.key !== action.payload.key)
		return {
			...state,
			followedLikes: newFollowedLikes
		}

		default: 
		return state;
	}
};

export default reducer;
