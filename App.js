import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';
import configureStore from './src/store/configureStore'
import HomeScreen from './src/screens/HomeScreen/HomeScreen';
import AuthScreen from './src/screens/AuthScreen/AuthScreen';
import ProfileScreen from './src/screens/ProfileScreen/ProfileScreen';
import GetPictureScreen from './src/screens/GetPictureScreen/GetPictureScreen';
import SideDrawer from './src/screens/SideDrawer/SideDrawer';
import PostDetailScreen from './src/screens/PostDetailScreen/PostDetailScreen';
import FollowersListScreen from './src/screens/FollowersListScreen/FollowersListScreen';
import SearchUserScreen from './src/screens/SearchUserScreen/SearchUserScreen';
import ContactProfileScreen from './src/screens/ContactProfileScreen/ContactProfileScreen';
import AlreadyFollowScreen from './src/screens/AlreadyFollowScreen/AlreadyFollowScreen';
import CommentsScreen from './src/screens/CommentsScreen/CommentsScreen';
import ContactChatScreen from './src/screens/ContactChatScreen/ContactChatScreen';
import ElementsSavedScreen from './src/screens/ElementsSavedScreen/ElementsSavedScreen';
import FollowRequestsScreen from './src/screens/FollowRequestsScreen/FollowRequestsScreen';
import ContactListScreen from './src/screens/ContactListScreen/ContactListScreen';
import WriteCommentScreen from './src/screens/WriteCommentScreen/WriteCommentScreen';

const store = configureStore();

Navigation.registerComponent(
	'insta-like.AuthScreen',
	() => AuthScreen,
	store,
	Provider
);
Navigation.registerComponent(
	'insta-like.HomeScreen',
	() => HomeScreen,
	store,
	Provider
);
Navigation.registerComponent(
	'insta-like.ProfileScreen',
	() => ProfileScreen,
	store,
	Provider
);
Navigation.registerComponent(
	'insta-like.GetPictureScreen',
	() => GetPictureScreen,
	store,
	Provider
);
Navigation.registerComponent(
	'insta-like.SideDrawer',
	() => SideDrawer,
	store,
	Provider
);
Navigation.registerComponent(
	'insta-like.PostDetailScreen',
	() => PostDetailScreen,
	store,
	Provider
);
Navigation.registerComponent(
	'insta-like.FollowersListScreen',
	() => FollowersListScreen,
	store,
	Provider
);
Navigation.registerComponent(
	'insta-like.SearchUserScreen',
	() => SearchUserScreen,
	store,
	Provider
);
Navigation.registerComponent(
	'insta-like.ContactProfileScreen',
	() => ContactProfileScreen,
	store,
	Provider
);
Navigation.registerComponent(
	'insta-like.AlreadyFollowScreen',
	() => AlreadyFollowScreen,
	store,
	Provider
);
Navigation.registerComponent(
	'insta-like.CommentsScreen',
	() => CommentsScreen,
	store,
	Provider
);
Navigation.registerComponent(
	'insta-like.ContactChatScreen',
	() => ContactChatScreen,
	store,
	Provider
);
Navigation.registerComponent(
	'insta-like.ElementsSavedScreen',
	() => ElementsSavedScreen,
	store,
	Provider
);
Navigation.registerComponent(
	'insta-like.FollowRequestsScreen',
	() => FollowRequestsScreen,
	store,
	Provider
);
Navigation.registerComponent(
	'insta-like.ContactListScreen',
	() => ContactListScreen,
	store,
	Provider
);
Navigation.registerComponent(
	'insta-like.WriteCommentScreen',
	() => WriteCommentScreen,
	store,
	Provider
);

Navigation.startSingleScreenApp({
	screen: {
		screen: 'insta-like.AuthScreen',
		navigatorStyle: {
			navBarHidden: true
		},
		animationType: 'fade'
	}
});