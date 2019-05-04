import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Image,
	FlatList,
	Text,
	Platform
} from 'react-native';
import { connect } from 'react-redux';
import { addComment } from '../../store/actions/index';

class CommentsScreen extends Component {

	constructor(props) {
		super(props);
		this.state = {
			comment: ""
		};
		this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
	}

	//Close screen.
	onNavigatorEvent = event => {
		if (event.type === 'NavBarButtonPress') {
			if (event.id === 'close') {
				this.props.navigator.dismissModal({
					animationType: 'slide-down'
				})
			}
		}
	}

	//Set comment time.
	timeLogicUtility = (date) => {
		const actualDate = Date.now();
		const minutesPassed = actualDate - date;
		const mins = minutesPassed / 60000;
		if (mins < 60) {
			return `${Math.floor(mins)} Minutes ago.`
		}
		if (mins > 60 && mins < 1440) {
			let h = Math.floor(mins / 60);
			return `${h} Hours ago.`
		}
		if (mins > 1440 && mins < 43200) {
			let d = Math.floor(mins / 1440);
			return `${d} Days ago.`
		}
		if (mins > 43200 && mins < 525600) {
			let m = Math.floor(mins / 43200);
			return `${m} Months ago.`
		}
	}

	render() {
		const { author, myPosts, myPostsComments } = this.props;

		const commentsToMyPosts = [];
		myPostsComments && author && myPosts.map(post => {
			myPostsComments.map(comment => {
				if (comment.author === author.key && comment.postId === post.key) {
					commentsToMyPosts.unshift({ ...post, message: comment.comment, date: comment.date })
				};
			})
		})
		console.log(commentsToMyPosts);
		return (
			<View style={[styles.container, { backgroundColor: Platform.OS === 'android' ? '#fff' : null }]}>
				<View style={{ padding: 10, width: '100%', height: '100%' }}>
					<FlatList
						style={{ width: '100%' }}
						extraData={{ author, myPosts }}
						data={commentsToMyPosts}
						renderItem={({ item, i }) => (
							<View
								style={{ marginTop: 5, flexDirection: 'column' }}>
								<View key={i} style={{ marginLeft: 10 }}>
									<Image
										style={{ width: 40, height: 40 }}
										source={{ uri: item.image }}
									/>
								</View>
								<View
									style={styles.text}>
									<Text>{item.message}</Text>
								</View>
								<View style={{flexDirection:'row',justifyContent: 'space-between'}}>
									<Text
										style={styles.dateText}>
										{this.timeLogicUtility(item.date)}
									</Text>
									<Text style={[styles.dateText,{marginRight:10}]}>{"Reply"}</Text>
								</View>
							</View>
						)}
						keyExtractor={(item, i) => item + i}
					/>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		width: '100%',
		height: '100%',
	},
	input: {
		width: '85%',
		height: 50,
		borderColor: '#aaa',
		borderRadius: 50,
		borderWidth: .75,
		padding: 10,
		backgroundColor: '#fff'
	},
	commentContainer: {
		flexDirection: 'row',
		width: '100%',
		alignItems: 'center',
		justifyContent: 'flex-start'
	},
	text: {
		borderColor: '#bbb',
		borderWidth: .75,
		borderRadius: 10,
		padding: 10,
		marginTop: 5
	},
	dateText: {
		alignSelf: 'flex-end',
		marginTop: 4,
		marginLeft: 10,
		fontSize: 12,
		color: '#aaa'
	}
});

const mapStateToProps = state => {
	return {
		sessionUser: state.users.user,
		myPosts: state.post.myPosts,
		myPostsComments: state.post.myPostsComments,
		author: state.users.contact
	}
};

const mapDispatchToProps = dispatch => {
	return {
		submitComment: (comment, sessionUserId, post) => dispatch(addComment(comment, sessionUserId, post))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(CommentsScreen);

