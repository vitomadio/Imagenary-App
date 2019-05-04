import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	Image,
	Platform,
	FlatList,
	TouchableOpacity
} from 'react-native';
import Avatar from '../UI/Avatar';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import withPreventDoubleClick from '../withPreventDoubleClick/withPreventDoubleClick';

const TouchableOpacityEx = withPreventDoubleClick(TouchableOpacity)

const post = (props) => (
		<View>
			<View style={styles.postHeadingContainer}>
				{props.users.map((user,i) => {
					if (user.key === props.post.userId){
					return (
						<View 
						style={styles.avatarContainer}
						key={i}
						>
						<Avatar
						key={i}
						style={styles.avatar}
						source={{uri: `${user.avatar}`}}
						/>
						<Text 
						style={{marginLeft:5}}
						>
						{user.email}
						</Text>
						</View>
						)
					}
					})
				}
				<TouchableOpacityEx
				onPress={props.onPress('more')}
				style={{marginRight:5}}
				>
				<Icon
				size={30}
				name={Platform.OS === 'android' ? 'md-more' : 'ios-more'}
				color="#aaa"
				/>
				</TouchableOpacityEx>
			</View>
		<Image 
		style={styles.image}
		source={props.post.image}
		/>
		<View style={{flexDirection:'row',alignItems:'center', height:30, width:'100%', marginTop:10}}>
			<View style={{flexDirection:'row',alignItems:'center', width:'33%',justifyContent:'space-around'}}>	
				<TouchableOpacityEx
				onPress={props.post.likes.filter(like => {return like.userId === props.sessionUser.key}).length >= 1
				? props.onPress('removeLike') : props.onPress('like')}
				>
				<Icon 
				size={30}
				name={Platform.OS === 'android' ? 'md-heart' : 'ios-heart'}
				color={props.post.likes.filter(like => {return like.userId === props.sessionUser.key}).length >= 1 
				? "red" : "#aaa"}
				/>
				</TouchableOpacityEx>
				<TouchableOpacityEx
				onPress={props.onPress('comment')}
				>
				<MaterialIcons
				size={30}
				name="mode-comment"
				color="#aaa"
				/>
				</TouchableOpacityEx>
				<TouchableOpacityEx
				onPress={props.onPress('sendPost')}
				>
				<Icon 
				size={30}
				name={Platform.OS === 'android' ? 'md-paper-plane' : 'ios-paper-plane'}
				color="#aaa"
				/>
				</TouchableOpacityEx>
			</View>
			<View style={{width:'65%',flexDirection:'row',justifyContent:'flex-end'}}>
				<TouchableOpacityEx
				onPress={props.onSavePost}
				>

				<Icon 
				size={30}
				name={Platform.OS === 'android' ? 'md-bookmark' : 'ios-bookmark'}
				color={props.sessionUser.savedElements.filter(element => element._uid === props.post.key).length >= 1 ? 
					"#48C9B0" : "#aaa" }
				/>
				</TouchableOpacityEx>
			</View>
			</View>
			<View style={{width:'35%',height:30,flexDirection:'row',alignItems:'center'}}>
				<Icon
				style={{marginLeft: 10, marginRight: 5}} 
				size={15}
				color="#000"
				name={Platform.OS === 'android' ? 'md-heart' : 'ios-heart'}
				/>
				<Text>
				{props.post.likes.length} {props.post.likes.length === 1 ? "Like" : "Likes"}
				</Text>
			</View>
			{props.post.comments.length >= 1 ? 
			<View>
			<Text 
			style={{marginLeft:5}}
			numberOfLines={5}
			>
			{props.post.comments[props.post.comments.length-1].comment}
			</Text>
			
			<TouchableOpacityEx
			onPress={props.onPress('comment')}
			>
			<Text style={{color:'#aaa',marginLeft:10, width:'100%'}}>
			See all comments...
			</Text>
			</TouchableOpacityEx>
			</View>
			: null}
		</View> 
	);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column'
	},
	image: {
		width: '100%',
		height: 300
	},
	postHeadingContainer: {
		height: 60,
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	avatarContainer: {
		width:'60%',
		height: 60,
		flexDirection: 'row',
		alignItems: 'center'
	},
	avatar: {
		height: 40,
		width: 40,
		borderRadius:20,
		marginRight: 10
	}
});

export default post;

