import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	
} from 'react-native';
import { connect } from 'react-redux'
import Button from '../../components/UI/Button';
import Profile from '../../components/Profile/Profile';
import ImagePicker from "react-native-image-picker";
import { changeAvatarImage, deletePost } from '../../store/actions/index';

class ProfileScreen extends Component {

	static navigatorStyle = {
		navBarButtonColor: "#fff"
	};

	constructor(props){
		super(props)
		
		this.state = {
			selectedPosts:[]
		}


		this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
	}

	onNavigatorEvent = event => {
		if (event.type === "NavBarButtonPress") {
			if (event.id === "sideDrawerToggle") {
				this.props.navigator.toggleDrawer({
					side: "right"
				});
			};
		};
	};

	onSelectPostHandler = (item, e) => {
		const post = {
			userId : item.userId,
			image : item.image,
			key : item.key,
			comments : item.comments,
			likes: item.likes
			}
		this.props.navigator.push({
			screen:'insta-like.PostDetailScreen',
			title: 'Post Details',
			navigatorStyle:{
				navBarButtonColor:'#fff'
			},
			passProps: {
				post: post
			}
		})
	};

	onChangeAvatarImageHandler = event => {
		event.preventDefault()
		ImagePicker.showImagePicker({title: "Pick an Image", maxWidth: 800, maxHeight: 800}, res => {
	      if (res.didCancel) {
	        console.log("User cancelled!");
	      } else if (res.error) {
	        console.log("Error", res.error);
	      } else {
	        this.setState(prevState => {
	        	return {
	        		...prevState,
	        		pickedImage: { uri: res.uri }
	        	}
	        });
	        const image = {uri: res.uri, base64: res.data}
	        this.props.onChangeAvatarImage(this.props.sessionUser,image);
	      }
	    });
	}

	onLongPressHandler = (post, e) => {
		this.setState(prevState => {
			return{
				...prevState,
				selectedPosts:[...prevState.selectedPosts, post]
			}
		});
	}
	//Selects post after edit tab is open.
	onPressImageHandler = (post, e) => {
		if(this.state.selectedPosts.filter(itemKey => itemKey == post).length >= 1){
			const posts = this.state.selectedPosts.filter(itemKey => itemKey !== post);
			return this.setState(prevState => {
				return{
					...prevState,
					selectedPosts:posts
				}
			});
		}
		this.setState(prevState => {
			return{
				...prevState,
				selectedPosts:[...prevState.selectedPosts, post]
			}
		});
	}
	//Deletes post.
	onDeletePostHandler = () =>{
		this.props.onDeletePost(this.state.selectedPosts)
		this.setState({selectedPosts: []})
	}

	render() {
		const followers = this.props.sessionUser.followsMe || [];
		const following = this.props.sessionUser.follow || [];
		const myPosts = this.props.myPosts

		const customButton = (
			<View style={{width:"35%"}}>
				<Button 
				title="Edit Profile"
				color="#fff"
				style={styles.buttonEdit}
				tnf={styles.tnf}
				/>
			</View>
			);

		return (
			<Profile 
				onChangeAvatar={this.onChangeAvatarImageHandler.bind(this)}
				posts={myPosts}
				user={this.props.sessionUser}
				onPress={(item) => this.onSelectPostHandler.bind(this, item)}
				followers={followers}
				following={following}
				isLoading={this.props.isLoading}
				button={customButton}
				deletePost={this.onDeletePostHandler}
				selectedPosts={this.state.selectedPosts}
				onLongPress={(post) => this.onLongPressHandler.bind(this, post)}
				onPressImage={(post) => this.onPressImageHandler.bind(this, post)}
			/>
		);
	};
};

const styles = StyleSheet.create({
	buttonEdit:{
		backgroundColor: '#8E97FF',
		borderRadius: 30
	},
	tnf:{
		borderRadius:30,
		width:'100%'
	}
});

const mapStateToProps = state => {
	return {
		sessionUser: state.users.user,
		myPosts: state.post.myPosts,
		userId: state.auth.userId,
		isLoading: state.ui.isLoading
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onChangeAvatarImage: (sessionUser, image) => dispatch(changeAvatarImage(sessionUser, image)),
		onDeletePost: (posts) => dispatch(deletePost(posts))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);