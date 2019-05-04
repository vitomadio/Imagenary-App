import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Platform,
  FlatList,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native';
import { connect } from 'react-redux';
import Post from '../../components/Post/Post';
import {
  getUsers,
  onPostLike,
  getPost,
  getPostComments,
  stopFollowing,
  savePost,
  getChat,
  sendPost,
  fetchNotReadedMessage,
} from '../../store/actions';
import Icon from 'react-native-vector-icons/Ionicons';
import ContactsList from '../../components/ContactsList/ContactsList';
import MoreModalHome from '../../components/MoreModalHome/MoreModalHome';


class HomeScreen extends Component {

  state = {
    like: false,
    modalVisible: false,
    selectedPost: null,
    selectedPostUser: null,
    contactListOpen: false,
    message: "",
    contactListOpened: false
  }

  constructor(props) {
    super(props)

    this.props.navigator.addOnNavigatorEvent(this.onNavigatorEvent);
  }

  componentWillMount() {
    this.reset();
  }

  componentDidUpdate() {
    const newMessages = this.props.newMessages;
    if (newMessages.length >= 1) {
      Icon.getImageSource(Platform.OS === 'android' ? 'md-send' : 'ios-send', 25, '#DA2E6B')
        .then((icon) => {
          this.props.navigator.setButtons({
            rightButtons: [
              {
                icon: icon,
              }
            ]
          });
        });
    }
  }

  reset = () => {
    this.setState({
      like: false,
      modalVisible: false,
      selectedPost: null,
      selectedPostUser: null,
      contactListOpen: false,
      message: "",
      contactListOpened: false
    })
  }

  //Setting icon for notification and assign navigation to it.
  onNavigatorEvent = event => {
    if (event.type === 'ScreenChangedEvent') {
      if (event.id === 'willAppear') {
        this.setState({ contactListOpened: false })
        this.props.fetchNotReadedMessage(this.props.sessionUser)
      }
    }
    if (event.type === 'NavBarButtonPress' && this.state.contactListOpened === false) {
      this.setState({ contactListOpened: true }, () => {
        this.props.navigator.push({
          screen: 'insta-like.ContactListScreen',
          title: 'Direct Message',
          navigatorStyle: {
            navBarButtonColor: '#fff',
          },
        });
      });
    };
  };

  onPressActionHandler(item, key, index) {
    if (key === 'like') {
      this.props.onPressLikeButton(item, this.props.userId, index, key);
    }
    if (key === 'removeLike') {
      this.props.onPressLikeButton(item, this.props.userId, index, key)
    }
    if (key === 'comment') {
      this.props.onGetPost(item.key);
      this.props.onGetPostComments(item.key);
      this.props.navigator.showModal({
        screen: 'insta-like.WriteCommentScreen',
        title: 'Post Comments',
        animationType: 'slide-up',
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
    };
    if (key === 'sendPost') {
      this.setState({
        contactListOpen: true,
        selectedPost: item
      })
    };
    if (key === 'more') {
      const postUser = this.props.sessionUser.follow.filter(user => { return user.key === item.userId })[0]
      this.setState(prevState => {
        return {
          ...prevState,
          modalVisible: true,
          selectedPost: item,
          selectedPostUser: postUser
        }
      });
    };

  };

  onCloseModalHandler = () => {
    this.setState(prevState => {
      return {
        ...prevState,
        modalVisible: false,
      }
    });
  };

  onStopFollowingUserHandler = () => {
    this.props.onStopFollowingUser(this.state.selectedPostUser, this.props.sessionUser)
      .then(res => console.log(JSON.stringify(res)))
  };

  onSeavePostHandler = (post, e) => {
    this.props.onSavePost(post, this.props.sessionUser)
  }

  onCloseContactsListHandler = () => {
    this.setState({ contactListOpen: false })
  }

  onChangeMessageHandler = (value) => {
    this.setState({
      message: value
    })
  }

  openChat = (item) => {
    this.props.onSendPost(this.state.message, this.state.selectedPost, this.props.sessionUser, item)
    this.props.getChat(this.props.sessionUser, item);

    this.props.navigator.showModal({
      screen: 'insta-like.ContactChatScreen',
      title: `${item.username} Private Chat`,
      animationType: 'fade',
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

  render() {
    const {posts,follow} = this.props;
    const postList = [];
    posts && posts.map(post => {
      follow.map(followed => {
        if (post.userId !== this.props.sessionUser.key && post.userId === followed.key) {
          postList.push(post)
        }
      })
    });

    const chatIcon = (
      <View style={{ position: 'absolute', top: 20, right: 20, hight: 20, width: 20, zIndex: 999 }}>
        <Icon
          title={Platform.OS === "android" ? "md-send" : "ios-send"}
          color="#fff"
          size={30}
        />
      </View>
    )

    return (
      <View
        style={styles.containerIos}
        contentInset={{ bottom: 20 }}>
        <MoreModalHome 
        visible={this.state.modalVisible}
        closeModal={this.onCloseModalHandler}
        modalVisible={() => {
          this.setModalVisible(!this.state.modalVisible);
        }}
        stopFollowing={this.onStopFollowingUserHandler}
        />
        {chatIcon}
        <ContactsList
          modalVisible={this.state.contactListOpen}
          closeModal={this.onCloseContactsListHandler}
          openChat={(item) => this.openChat.bind(this, item)}
          onChangeText={(value) => this.onChangeMessageHandler(value)}
        />
        <FlatList
          style={styles.container}
          extraData={this.props.users}
          data={postList}
          renderItem={({ item, index }) => (
            item ?
              <Post
                post={item}
                users={this.props.users}
                onPress={(key) => this.onPressActionHandler.bind(this, item, key, index)}
                sessionUser={this.props.sessionUser}
                onSavePost={this.onSeavePostHandler.bind(this, item)}
              />
              : null
          )}
          keyExtractor={item => item.key}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerIos: {
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#fff'
  }
  
});

const mapStateToProps = state => {
  return {
    sessionUser: state.users.user,
    users: state.users.users,
    posts: state.post.posts,
    userId: state.auth.userId,
    follow: state.users.follow,
    newMessages: state.users.notReadMessages
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onLoadApp: (userId) => {dispatch(getUsers())},
    onPressLikeButton: (post, sessionUserId, index, actionMode) => dispatch(onPostLike(post, sessionUserId, index, actionMode)),
    onGetPost: (postId) => dispatch(getPost(postId)),
    onGetPostComments: (postId) => dispatch(getPostComments(postId)),
    onStopFollowingUser: (stopFollowUser, sessionUser) => dispatch(stopFollowing(stopFollowUser, sessionUser)),
    onSavePost: (post, sessionUser) => dispatch(savePost(post, sessionUser)),
    getChat: (sessionUser, recipient) => dispatch(getChat(sessionUser, recipient)),
    onSendPost: (message, post, sessionUser, recipient) => dispatch(sendPost(message, post, sessionUser, recipient)),
    fetchNotReadedMessage: (sessionUser) => dispatch(fetchNotReadedMessage(sessionUser))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);