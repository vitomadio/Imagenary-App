import React, { Component } from 'react';
import { Alert } from 'react-native';
import { connect } from 'react-redux';
import { getChat, stopFollowing, startFollowing, sendInvitation } from '../../store/actions';
import ContactProfile from '../../components/ContactProfile/ContactProfile';

class ContactProfileScreen extends Component {

  static navigatorStyle = {
    navBarButtonColor: "#aaa"
  };

  constructor(props) {
    super(props);
  }

  onSelectPostHandler = (item, e) => {
    e.preventDefault();
    const post = {
      userId: item.userId,
      image: item.image,
      key: item.key,
      comments: item.comments,
      likes: item.likes
    }
    this.props.navigator.push({
      screen: 'insta-like.PostDetailScreen',
      title: 'Post Details',
      passProps: {
        post: post
      }
    });
  };

  //Open contact chat 
  openChatHandler = (item) => {
    this.props.getChat(this.props.sessionUser, item);
    this.props.navigator.showModal({
      screen: 'insta-like.ContactChatScreen',
      title: `${item.username} Private Chat`,
      animationType: 'slide-up',
      passProps: {
        author: item
      },
      navigatorButtons: {
        rightButtons: [
          {
            title: 'Close',
            id: "close"
          }
        ]
      },
      navigatorStyle: {
        navBarButtonColor: '#fff'
      }
    });
  }

  //Stop Follow user.
  onStopFollowHandler = (contact) => {
    Alert.alert(
      "Stop Follow User",
      "Sure you do not want to follow this user anymore?",
      [
        { text: 'Cancel', onPress: () => console.log('Cancel') },
        { text: 'Ok', onPress: () => this.props.onStopFollowing(this.props.sessionUser, contact) }
      ],
      { cancelable: false }
    )
  }

  //Start following user.
  onStartFollowingHandler = (contact) => {
    const followsMe = this.props.followsMe.filter(follower => follower.key === contact.key).length >= 1 ? true : false;
    if (!followsMe) {
      Alert.alert(
        "Send Invitation",
        "Send an invitation to the user to follow you on Instalike.",
        [
          { text: 'Cancel', onPress: () => console.log('cancel') },
          {
            text: 'Ok', onPress: () => this.props.onSendInvitation(
              contact,
              this.props.sessionUser
            )
          }
        ],
        { cancelable: false }
      )
    } else {
      Alert.alert(
        "Start following ",
        "Confirm that you want to start fallowing this user",
        [
          { text: 'Cancel', onPress: () => console.log('Cancel') },
          {
            text: 'Ok', onPress: () => this.props.onStartFollowing(
              contact,
              this.props.sessionUser
            )
          }
        ],
        { cancelable: false }
      )
    }
  }

  render() {

    const posts = this.props.posts.filter(post => post.userId === this.props.user.key);
    const contact = this.props.user;
    const followed = this.props.follow.filter(followed => followed.key === contact.key).length >= 1 ? true : false;

    return (
      <ContactProfile
        user={contact}
        posts={posts}
        onPress={(item) => this.onSelectPostHandler.bind(this, item)}
        openChat={this.openChatHandler.bind(this, contact)}
        stopFollow={this.onStopFollowHandler.bind(this, contact)}
        startFollowing={this.onStartFollowingHandler.bind(this, contact)}
        followed={followed}
      />
    );
  };
};

const mapStateToProps = state => {
  return {
    posts: state.post.posts,
    contact: state.users.contact,
    sessionUser: state.users.user,
    follow: state.users.follow,
    followsMe: state.users.followsMe
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getChat: (sessionUser, recipient) => dispatch(getChat(sessionUser, recipient)),
    onStopFollowing: (sessionUser, followedUser) => dispatch(stopFollowing(sessionUser, followedUser)),
    onStartFollowing: (followUser, sessionUser) => dispatch(startFollowing(followUser, sessionUser)),
    onSendInvitation: (userInvited, sessionUser) => dispatch(sendInvitation(userInvited, sessionUser)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactProfileScreen);