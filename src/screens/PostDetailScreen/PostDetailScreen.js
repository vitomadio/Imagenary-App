import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
	Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

class PostDetailScreen extends Component {

	constructor(props) {
		super(props)
	}

	render() {

		const post = this.props.post;

		return (
			<View style={styles.container} >
				<Image
					style={styles.image}
					source={{uri: post.image}}
				/>
				<View style={{ flexDirection: 'row', alignItems: 'center', height: 30, width: '100%', marginTop: 10 }}>
					<View style={{ flexDirection: 'row', alignItems: 'center', width: '33%', justifyContent: 'space-around' }}>
						<Icon
							size={30}
							name={Platform.OS === 'android' ? 'md-heart' : 'ios-heart'}
							color="#aaa"
						/>
						<MaterialIcons
							size={30}
							name="mode-comment"
							color="#aaa"
						/>
						<Icon
							size={30}
							name={Platform.OS === 'android' ? 'md-paper-plane' : 'ios-paper-plane'}
							color="#aaa"
						/>
					</View>
					<View style={{ width: '65%', flexDirection: 'row', justifyContent: 'flex-end' }}>
						<Icon
							size={30}
							name={Platform.OS === 'android' ? 'md-bookmark' : 'ios-bookmark'}
							color="#aaa"
						/>
					</View>
				</View>
				{post.likes && post.likes.length >= 1 ?
					<View style={{ width: '100%', height: 30, flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
						<Icon
							size={15}
							color="#000"
							name={Platform.OS === 'android' ? 'md-heart' : 'ios-heart'}
						/>
						<Text style={{ marginLeft: 10 }}>
							{post.likes.length} {post.likes.length > 1 ? "Likes" : "Like"}
						</Text>
					</View>
					: null}
				<Text
					style={{ marginLeft: 10, width: '100%' }}
					numberOfLines={5}
				>
					{post.comments && post.comments.length >= 1 ? `${post.comments[0].comment}...` : null}
				</Text>
				<Text style={{ color: '#ccc', width: '100%', marginTop: 5, marginLeft: 10 }}>
					Visualize all comments
		</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		flexDirection: 'column',
		padding: 10
	},
	post: {
		marginTop: 15
	},
	image: {
		width: '100%',
		height: 300
	}
});


export default PostDetailScreen;