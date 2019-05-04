import {
	SET_POSTS,
	SET_POST,
	SET_POST_LIKE,
	SET_POST_COMMENTS,
	ADDED_NEW_POST,
	ON_POST_DELETED,
	ON_MY_POST_SET,
	ON_GET_MY_POSTS_COMMENTS,
	REMOVE_POSTS_COMMENTS
} from '../actions/actionsTypes.js';

const initialState = {
	posts: [],
	post: {},
	postComments: [],
	myPosts: [],
	myPostsComments: []
}

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_POSTS:
			return {
				...state,
				posts: action.posts
			}

		case SET_POST:
			return {
				...state,
				post: action.post
			}

		case ON_MY_POST_SET:
			return {
				...state,
				myPosts: action.payload
			}

		case SET_POST_LIKE:
			newPosts[action.index].like = !newPosts[action.index].like
			return {
				...state,
				posts: newPosts
			}

		case SET_POST_COMMENTS:
			return {
				...state,
				postComments: action.comments
			}

		case ON_GET_MY_POSTS_COMMENTS:
			return {
				...state,
				myPostsComments: [...state.myPostsComments.filter(item => item.commentKey !== action.payload.commentKey), action.payload]
			}

		case REMOVE_POSTS_COMMENTS:
			return {
				...state,
				myPostsComments: state.myPostsComments.filter(comment => comment.postId !== action.payload.key)
			}

		case ADDED_NEW_POST:
			return {
				...state,
				posts: [...state.posts, action.payload]
			}

		case ON_POST_DELETED:
			return {
				...state,
				myPosts: state.myPosts.filter(post => post.key !== action.payload.key)
			}


		default:
			return state;
	}
};

export default reducer;
