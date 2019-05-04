import { Navigation } from 'react-native-navigation';
import { Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const startTabs = (props) => {
	Promise.all([
		Icon.getImageSource(Platform.OS === 'android' ? 'md-home' : 'ios-home', 30),
		Icon.getImageSource(Platform.OS === 'android' ? 'md-search' : 'ios-search', 30),
		Icon.getImageSource(Platform.OS === 'android' ? 'md-camera' : 'ios-camera', 30),
		Icon.getImageSource(Platform.OS === 'android' ? 'md-person' : 'ios-person', 30),
		Icon.getImageSource(Platform.OS === 'android' ? "md-menu" : "ios-menu", 30,'#fff'),
		Icon.getImageSource(Platform.OS === 'android' ? "md-heart-empty" : "ios-heart-empty", 30),
		Icon.getImageSource(Platform.OS === 'android' ? "md-heart" : "ios-heart", 30),
		Icon.getImageSource(Platform.OS === 'android' ? 'md-send' : 'ios-send', 25, '#fff')
		]).then(sources => {
			Navigation.startTabBasedApp({
				tabs: [
					{
						screen:'insta-like.HomeScreen',
						title:'Imagenary',
						icon: sources[0],
						navigatorButtons:{
							rightButtons:[
								{
									icon:sources[7],
									
								}
							]
						},
						navBarButtonColor: '#fff'
					},
					{
						screen:'insta-like.SearchUserScreen',
						title: 'Search',
						icon: sources[1]
					},
					{
						screen:'insta-like.GetPictureScreen',
						icon: sources[2],
						navigatorStyle: {
					    	navBarHidden: true
					    }
					},
					{
						screen:'insta-like.AlreadyFollowScreen',
						title: "ALREADY FOLLOW",
						icon: sources[5]
					},
					{
						screen:'insta-like.ProfileScreen',
						title: 'Profile',
						icon: sources[3],
						navigatorButtons: {
	                        rightButtons: [
	                            {
	                                icon: sources[4],
	                                title: 'Menu',
									id: "sideDrawerToggle",
	                            }
	                        ]
						},
					}
				],
				tabsStyle: {
					tabBarSelectedButtonColor: '#48C9B0',
					tabBarButtonColor: '#aaa',
					tabBarBackgroundColor: '#eee',
					tabBarZIndex:998,
				},
				drawer: {
	                right: {
	                    screen: "insta-like.SideDrawer"
	                }
	            },
				appStyle: {
					orientation: 'portrait',
					navigatorButtonColor: '#fff',
					navBarBackgroundColor: '#48C9B0',
					navBarTextColor: '#fff',
					navBarTextFontSize: 18,
					navBarTextFontFamily: 'Helvetica Neue',
					tabBarSelectedButtonColor:'#48C9B0'
				}
			});
		});
};

export default startTabs;