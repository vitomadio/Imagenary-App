import React, { Component } from 'react';
import {
	StyleSheet,
	ScrollView,
	FlatList,
	View,
	Alert,
	} from 'react-native';
import { connect } from 'react-redux';
import UserHeading from '../../components/UserHeading/UserHeading';
import TextInputWithIcon from '../../components/UI/TextInputWithIcon';
import { 
	sendInvitation, 
	removeInvitation, 
	getUser, 
	acceptInvitation, 
	rejectRequest,
	startFollowing,
	stopFollowing,
	removeFollower
} from '../../store/actions/index';

class SearchUserScreen extends Component {
	state = {
		searchfield: ""
	};

	constructor(props) {
		super(props);
	};

	searchUserHandler = (value) => {
		this.setState(prevState => {
			return {
				...prevState,
				searchfield: value
			}
		});
	};

	openModalOptions = (key, user, e) => {
		if(key === "add") {
			Alert.alert(
			"Send Invitation",
			"Send an invitation to the user to follow you on Instalike.",
			[
			{text: 'Cancel', onPress: () => console.log('cancel')},
			{text: 'Ok', onPress: () => this.props.onSendInvitation(
				user, this.props.sessionUser
				)}
			],
			{cancelable: false}
			)
		}
		if(key === "remove") {
			Alert.alert(
			"Have you changed your mind",
			"Confirm that you don't want to follow the user anymore",
			[
			{text: 'Cancel', onPress: () => console.log('cancel')},
			{text: 'Ok', onPress: () => this.props.onRemoveInvitation(
				user, this.props.sessionUser
				)}
			],
			{cancelable: false}
			)
		}
		if (key === "accept") {
			Alert.alert(
				"Start following ",
				"Confirm that you want to start fallowing this user",
				[
				{text: 'Cancel', onPress: () => console.log('Cancel')},
				{text: 'Ok', onPress: () => this.props.onAcceptInvitation(
					user, 
					this.props.sessionUser)}
				],
				{cancelable: false}
				)
		} 
		//Reject invitation from user.
		if (key === "reject") {
			Alert.alert(
				"Reject Follow Request",
				"Confirm that you don't want this user to follows you",
				[
				{text: 'Cancel', onPress: () => console.log('Cancel')},
				{text: 'Ok', onPress: () => this.props.onRejectRequest(user, this.props.sessionUser)}
				],
				{cancelable: false}
				)
		}
		//Start following some follower.
		if ( key === "startFollowing"){
			Alert.alert(
				"Start following ",
				"Confirm that you want to start fallowing this user",
				[
				{text: 'Cancel', onPress: () => console.log('Cancel')},
				{text: 'Ok', onPress: () => this.props.onStartFollowing(
					user, 
					this.props.sessionUser
					)}
				],
				{cancelable: false}
				)
		}
		//Stop following contact.
		if (key === "stopFollowing"){
			Alert.alert(
				"Stop Follow User",
					"Sure you do not want to follow this user anymore?",
					[
						{text: 'Cancel', onPress: () => console.log('Cancel')},
						{text: 'Ok', onPress: () => this.props.onStopFollowing(
							this.props.sessionUser,
							user
							)}
					],
					{cancelable: false}
			)
		}
	};

	onOpenProfileHandler = (item) => {
		this.props.onGetUser(item.key);
		this.props.navigator.push({
			screen:'insta-like.ContactProfileScreen',
			title:item.username,
			navigatorStyle:{
				navBarButtonColor:'#fff'
			},
			passProps: {
				user: item,
			}
		})
	}

	onRemoveFollowerHandler = (user) => {
		Alert.alert(
			"Prevent this user to follow you",
				"This user will not have access to your posts or info.",
				[
					{text: 'Cancel', onPress: () => console.log('Cancel')},
					{text: 'Ok', onPress: () => this.props.onRemoveFollower(
						user,
						this.props.sessionUser
						)}
				],
				{cancelable: false}
		)
	}

	render() {
		const userRequests = this.props.sessionUser.requests || [];
		const invitations = this.props.sessionUser.invitations || [];
		const followed = this.props.sessionUser.follow || [];
		const followsMe = this.props.sessionUser.followsMe || [];
		const contacts = userRequests.concat(invitations); 
		const filteredUsers = this.props.users.filter(user => {
			if(user && user.key !== this.props.userId){
				return user.username.includes(this.state.searchfield.toLowerCase())
			};
		})
		return (
			<View style={styles.container}>
			<TextInputWithIcon 
			style={styles.input}
			placeholder="Search"
			onChangeText={this.searchUserHandler}
			/>
			<ScrollView style={styles.scroll}>
			<FlatList
			style={styles.list}
			data={filteredUsers}
			renderItem={({item}) => (
				contacts.filter(contact => contact.key === item.key).length >= 1 
				|| followed.length >= 1 
				|| followsMe.length >= 1 
				?
				<UserHeading
				openProfile={this.onOpenProfileHandler.bind(this, item)}
				onRejectRequest={
					followsMe.filter(contact => contact.key === item.key).length >= 1 ?
					this.onRemoveFollowerHandler.bind(this, item) :
					this.openModalOptions.bind(this, "reject", item)}
				onPress={
					invitations.filter(contact => contact.key === item.key).length >= 1
					? this.openModalOptions.bind(this, "remove", item) : 
					invitations.filter(contact => contact.key === item.key).length < 1
					&& followed.filter(contact => contact.key === item.key).length >=1 
					? this.openModalOptions.bind(this, "stopFollowing", item) : 
					userRequests.filter(contact => contact.key === item.key).length >=1
					? this.openModalOptions.bind(this, "accept", item) : 
					followsMe.filter(contact => contact.key === item.key).length >= 1 
					? this.openModalOptions.bind(this, "startFollowing", item) :
					this.openModalOptions.bind(this, "add", item)
				}
				
				user={item}
				icon={
				followed.filter(followedUser => followedUser.key === item.key).length >= 1 
				? "person" :
				userRequests.filter(contact => contact.key === item.key).length >= 1 
				? "person-add" :
				invitations.filter(contact => contact.key === item.key).length >= 1
				? "remove-circle-outline" :
				followsMe.filter(contact => contact.key === item.key).length >= 1
				? "person" : "person-add"
				} 
				iconColor={
				followed.filter(followedUser => followedUser.key === item.key).length >= 1
				?  "#8E97FF" :
				userRequests.filter(contact => contact.key === item.key).length >= 1 
				? "#48C9B0" :
				invitations.filter(contact =>  contact.key === item.key).length >= 1
				? "red" : "#ccc"
				}
				icon2={
				userRequests.filter(contact => contact.key === item.key).length >= 1 
				? "remove-circle-outline" : 
				followsMe.filter(contact => contact.key === item.key).length >= 1 &&
				followed.filter(contact => contact.key === item.key).length < 1
				? "remove-circle-outline" : 
				null
				}
				iconColor2="red"
				text={
					followed.filter(followedUser => followedUser.key === item.key).length >= 1 
				? "Following" :
					userRequests.filter(contact => contact.key === item.key).length >= 1 
				? "Wants to follow you" : 
					invitations.filter(contact => contact.key === item.key).length >= 1
				? "Request sent" :
					followed.filter(followedUser => followedUser.key === item.key).length < 1 &&
					followsMe.filter(contact => contact.key === item.key).length >= 1
				? "Follows you" 
				: null
				}
				textStyle={{color:'#8E97FF'}}
				/> :
				<UserHeading
				openProfile={this.onOpenProfileHandler.bind(this, item)}
				onPress={this.openModalOptions.bind(this,"add", item)}
				user={item}
				icon="person-add" 
				iconColor="#bbb"
				/>
				)}
			keyExtractor={item => item.key}
			/>
			</ScrollView>
			</View>
			);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		height: '100%',
		width: '100%',
		padding: 10
	},
	scroll: {
		height: '100%'
	},
	list:{
		height: '100%',
		paddingRight: 10,
		padding:10
	},
	input: {
		borderColor: '#ccc',
		borderWidth: 1,
		width: '95%',
		marginTop: 10,
		borderRadius: 40
	}
});

const mapStateToProps = state => {
	return {
		users: state.users.users,
		userId: state.auth.userId,
		sessionUser: state.users.user,
		follow: state.users.follow,
		followsMe: state.users.followsMe,
		invitations: state.users.invitations
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onSendInvitation: (userInvited, sessionUser) => dispatch(sendInvitation(userInvited, sessionUser)),
		onRemoveInvitation: (userInvited, sessionUser) => dispatch(removeInvitation(userInvited, sessionUser)),
		onGetUser: (userId) => dispatch(getUser(userId)),
		onAcceptInvitation: (userRequest, sessionUser) => dispatch(acceptInvitation(userRequest, sessionUser)),
		onRejectRequest: (userRequest, sessionUser) => dispatch(rejectRequest(userRequest, sessionUser)),
		onStartFollowing: (followUser, sessionUser) => dispatch(startFollowing(followUser, sessionUser)),
		onStopFollowing: (sessionUser, followedUser) => dispatch(stopFollowing(sessionUser, followedUser)),
		onRemoveFollower: (removeUser, sessionUser) => dispatch(removeFollower(removeUser, sessionUser))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchUserScreen);

