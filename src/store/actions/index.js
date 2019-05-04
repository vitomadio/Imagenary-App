export { 
	authSubmit, 
	authAutoSignIn, 
	authLogout,
	authGetToken 
	 } from './authActions';

export { 
	addPost,
	getPosts,
	getPost,
	getPostComments,
	onPostLike,
	addComment,
	openComment,
	deletePost,
	getMyPosts,
	getMyPostsComments
	 } from './postActions';

export {
	getUsers,
	getUser,
	getSessionUser,
	sendInvitation,
	acceptInvitation,
	startFollowing,
	stopFollowing,
	removeFollower,
	changeAvatarImage,
	rejectRequest,
	removeInvitation,
	savePost,
	getRequestsInfo,
	getInvitedInfo,
	getUserPromise,
	getContacts
	 } from './usersActions';

export {
	addChat,
	getChat,
	deleteChat,
	fetchNotReadedMessage,
	fetchMessagesByTen,
	sendPost
} from './chatActions';

export {
	uiStartLoading,
	uiStopLoading,
	activityOn
} from './uiActions'