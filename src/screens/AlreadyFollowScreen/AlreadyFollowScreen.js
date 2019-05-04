import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  FlatList,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import {
  acceptInvitation,
  stopFollowing,
  getUser,
  openComment,
  rejectRequest,
  removeInvitation,
  getRequestsInfo,
  getUserPromise
} from '../../store/actions';
import Icon from 'react-native-vector-icons/Ionicons';
import Avatar from '../../components/UI/Avatar';
import firebase from 'react-native-firebase';
import withPreventDoubleClick from '../../components/withPreventDoubleClick/withPreventDoubleClick';

const TouchableOpacityEx = withPreventDoubleClick(TouchableOpacity)

const db = firebase.database();

class PeopleIFollow extends Component {

  state = {
    myFollowersOpen: false,
    users: []
  };

  constructor(props) {
    super(props);
    this.props.navigator.addOnNavigatorEvent(this.onNavigatorEvent);
  };

  componentDidUpdate() {
      //Check for new comments.
      const comments = this.props.myPostsComments;
      const seenComments = comments.filter(comment => comment.seen === false);
      if (seenComments.length >= 1) {
        Icon.getImageSource(Platform.OS === 'android'
          ? 'md-notifications'
          : 'ios-notifications',
          25, '#DA2E6B'
        )
          .then((icon) => {
            this.props.navigator.setButtons({
              rightButtons: [
                {
                  icon: icon,
                },
                {
                  title: "YOU",
                  buttonColor: "#fff"
                }
              ],
            });
          });
      } else {
        this.props.navigator.setButtons({
          rightButtons: [
            {
              title: "YOU",
              buttonColor: "#fff"
            }
          ]
        });
      }
  }

  //Navigate to Followers screen.
  onNavigatorEvent = event => {
    if (event.type === 'NavBarButtonPress' && this.state.myFollowersOpen === false) {
      this.setState({
        myFollowersOpen: true
      }, () => {
        this.props.navigator.push({
          navigatorStyle: {
            navBarButtonColor: '#fff'
          },
          screen: 'insta-like.FollowersListScreen',
          title: 'YOU',
          animationType: 'slide-horizontal'
        });
      })
    }
    //This will trigger as soon as open screen.
    if (event.type === 'ScreenChangedEvent') {
      if (event.id === 'willAppear') {
        this.props.onGetRequestsInfo(this.props.sessionUser)
        
        //Sets users list that likes any of my posts to state.
        if (this.props.followedLikes) {
          const users = [];
          this.props.followedLikes.map(item => {
            db.ref('/users/' + item.post.userId).once('value')
              .then(snapshot => {
                if (users.filter(user => user.key === snapshot.key).length < 1) {
                  users.push({ ...snapshot.val(), key: snapshot.key });
                }
                return users
              })
              .then(response => {
                this.setState({ users: response })
              })
          })
        }
        //Sets state to avoid double tapping
        this.setState({ myFollowersOpen: false });

      
      }
    };
  };

  //Open contact profile.
  openContactProfile = (item) => {
    this.props.onGetUser(item.key);
    this.props.navigator.push({
      navigatorStyle: {
        navBarButtonColor: '#fff'
      },
      screen: 'insta-like.ContactProfileScreen',
      title: item.username,
      passProps: {
        user: item
      }
    });
  };

  onSelectPostHandler = (item, e) => {
    const post = {
      userId: item.userId,
      image: { uri: item.image },
      key: item.key,
      comments: item.comments,
      likes: item.likes
    };
    this.props.navigator.push({
      screen: 'insta-like.PostDetailScreen',
      title: 'Post Details',
      navigatorStyle: {
        navBarButtonColor: '#fff'
      },
      passProps: {
        post: post
      }
    });
  };

  //Stop  following button handler.
  onStopFollowingHandler = (item, e) => {
    e.preventDefault();
    this.props.onStopFollowing(item, this.props.sessionUser);
  };

  //Open follows requests.
  openFollowRequests = () => {
    this.props.navigator.push({
      screen: 'insta-like.FollowRequestsScreen',
      title: "Requests to follow you",
      animationType: 'fade',
      navigatorStyle: {
        navBarButtonColor: '#fff',
      }
    });
  };

  //Go to user comment when avatar is pressed.
  openContactChatHandler = (item) => {
    const comments = this.props.sessionUser.comments.filter(comment => {
      return comment.author === item.key && !comment.seen
    });
    this.props.onOpenComment(this.props.userId, item.key, comments);
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
  };

  //Get date from Timestamp.
  getDate = (date) => {
    const d = new Date(date);
    const releaseDate = d.getDate();
    return releaseDate;
  };

  render() {
    const { sessionUser } = this.props;
    const followersLikes = this.props.followedLikes || [];
    const followedLikes = followersLikes.filter(like => like.post.userId !== sessionUser.key);
    console.log(followedLikes);
    //Rearrange likes from followed 
    const newFollowedLikes = [];
    followedLikes.map((item, i) => {
      if (followedLikes[i - 1]) {
        if (this.getDate(item.date) == this.getDate(followedLikes[i - 1].date) &&
          item.followed.key === followedLikes[i - 1].followed.key) {
          if (!Array.isArray(item.post)) {
            newFollowedLikes.push({ date: followedLikes[i - 1].date, followed: item.followed, post: [item.post, followedLikes[i - 1].post] })
            newFollowedLikes.splice(i - 1, 1);
          } else {
            newFollowedLikes.push({ date: followedLikes[i - 1].date, followed: item.followed, post: [...item.post, followedLikes[i - 1].post] })
            newFollowedLikes.splice(i - 1, 1);
          }
        } else {
          newFollowedLikes.push(item);
        }
      } else {
        newFollowedLikes.push(item);
      }
    })
    const followsActivities = this.props.followsActivities;
    //Rearrange following activity from followed
    const newFollowsActivities = [];
    followsActivities.map((item, i) => {
      if (followsActivities[i - 1]) {
        if (this.getDate(item.date) == this.getDate(followsActivities[i - 1].date) &&
          item.followed.key === followsActivities[i - 1].followed.key) {
          if (!Array.isArray(item.follows)) {
            newFollowsActivities.splice(i - 1, 1);
            newFollowsActivities.push({ date: followsActivities[i - 1].date, followed: item.followed, follows: [item.follows, followsActivities[i - 1].follows] })
          } else {
            newFollowsActivities.splice(i - 1, 1);
            newFollowsActivities.push({ date: followsActivities[i - 1].date, followed: item.followed, follows: [...item.follows, followsActivities[i - 1].follows] })
          }
        } else {
          newFollowsActivities.push(item)
        }
      } else {
        newFollowsActivities.push(item)
      }
    });

    //Order Activity by date Desc.
    const activities = newFollowsActivities.concat(newFollowedLikes).sort((a, b) => {
      a = new Date(a.date);
      b = new Date(b.date);
      return a > b ? -1 : a < b ? 1 : 0;
    });

    return (

      <View style={styles.viewsContainer}>
        {followed.length >= 1 ?
          <FlatList
            style={styles.flatList}
            extrData={sessionUser}
            data={activities}
            renderItem={({ item, i }) => (
              <View
                style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <View style={{ flexDirection: 'row', marginBottom: 8, width: '100%' }}>
                  {item.follows && item.follows.key === this.props.sessionUser.key ?
                    null
                    :
                    <TouchableOpacityEx
                      onPress={this.openContactProfile.bind(this, item.followed)}
                    >
                      <Avatar
                        style={styles.avatar}
                        source={{ uri: item.followed.avatar }}
                      />
                    </TouchableOpacityEx>
                  }
                  {item.follows && Array.isArray(item.follows) ?
                    <View>
                      <View style={{ justifyContent: 'center' }}>
                        <Text style={{ fontSize: 13, fontWeight: 'bold' }}>{item.followed.username}</Text>
                        <Text style={{ fontSize: 12 }}>{"Is now following  "}
                          <Text style={{ fontWeight: '600', fontSize: 13 }}>
                            {item.follows.length >= 2 ? item.follows[0].username + ',' + ' ' +
                              item.follows[1].username + '...'
                              : item.follows[0].username}
                          </Text>
                        </Text>
                      </View>
                      <FlatList
                        style={{ marginTop: 5 }}
                        data={item.follows}
                        horizontal={true}
                        renderItem={({ item }) => (
                          <TouchableOpacityEx
                            onPress={this.openContactProfile.bind(this, item)}
                          >
                            <Avatar
                              style={styles.avatarSmall}
                              source={{ uri: item.avatar }}
                            />
                          </TouchableOpacityEx>
                        )}
                        keyExtractor={(item, index) => item + index}
                      />
                    </View>
                    :
                    item.follows && item.follows.key !== this.props.sessionUser.key ?
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexGrow: 1 }}>
                        <View style={{ justifyContent: 'center' }}>
                          <Text style={{ fontSize: 13, fontWeight: 'bold' }}>{item.followed.username}</Text>
                          <Text style={{ fontSize: 12 }}>{"Is now following  "}
                            <Text style={{ fontWeight: '600', fontSize: 13 }}>
                              {item.follows.username}
                            </Text>
                          </Text>
                        </View>
                        <TouchableOpacityEx
                          onPress={this.openContactProfile.bind(this, item)}
                        >
                          <Avatar
                            style={[styles.avatarSmall]}
                            source={{ uri: item.follows.avatar }}
                          />
                        </TouchableOpacityEx>
                      </View>
                      : null
                  }
                  {item.post && Array.isArray(item.post) ?
                    <View>
                      <View style={{ justifyContent: 'center' }}>
                        <Text style={{ fontSize: 13, fontWeight: 'bold' }}>{item.followed.username}</Text>
                        {users.map((user, i) => {
                          if (this.state.user.key === item.post[0].userId) {
                            return (<Text key={i} style={{ fontSize: 12 }}>
                              {`Likes ${user.username} post and ${item.post.length - 1} more post`}{item.post.lenght > 1 && 's'}</Text>
                            )
                          }
                        })
                        }
                      </View>
                      <View style={{ marginTop: 7, marginBottom: 0, height: 40 }}>
                        <FlatList
                          data={item.post}
                          horizontal={true}
                          renderItem={({ item, index }) => (
                            <TouchableOpacityEx
                              onPress={this.onSelectPostHandler.bind(this, item)}
                            >
                              <Avatar
                                style={styles.postImage}
                                source={{ uri: item.image }}
                              />
                            </TouchableOpacityEx>
                          )}
                          keyExtractor={(item, index) => item + index}
                        />
                      </View>
                    </View>
                    :
                    item.post && !Array.isArray(item.post) ?
                      <View style={{ flexDirection: 'row', alignItems: 'center', flexGrow: 1, justifyContent: 'space-between' }}>
                        <View style={{ justifyContent: 'center' }}>
                          <Text style={{ fontSize: 13, fontWeight: 'bold' }}>{item.followed.username}</Text>
                          {this.state.users.map((user, i) => {
                            if (user.key === item.post.userId) {
                              return <Text key={i} style={{ fontSize: 12 }}>{`Likes ${user.username} post`}</Text>
                            }
                          })
                          }
                        </View>
                        <TouchableOpacityEx
                          onPress={this.onSelectPostHandler.bind(this, item.post)}
                        >
                          <Image
                            style={[styles.postImage]}
                            source={{ uri: item.post.image }}
                          />
                        </TouchableOpacityEx>
                      </View>
                      : null
                  }
                </View>

              </View>

            )}
            keyExtractor={(item, i) => item + i}
          />
          : null}
      </View>

    );
  }
}

const styles = StyleSheet.create({

  flatList: {
    width: '100%',
    padding: 10
  },
  headingText: {
    color: '#aaa',
    fontSize: 22,
    marginTop: 10,
    marginLeft: 16
  },
  viewsContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  buttonContainer: {
    backgroundColor: '#8E97FF',
    paddingLeft: 7,
    paddingRight: 7,
    paddingTop: 5,
    paddingBottom: 5,
    marginRight: 15,
    borderRadius: 20
  },
  buttonText: {
    fontSize: 10
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    width: '90%',
    marginTop: 10,
    borderRadius: 40
  },
  avatar: {
    height: 46,
    width: 46,
    marginRight: 10,
    borderRadius: 23
  },
  avatarSmall: {
    height: 36,
    width: 36,
    marginRight: 5,
    borderRadius: 18
  },
  postImage: {
    height: 36,
    width: 36,
    marginRight: 5,
  }
});

const mapStateToProps = state => {
  return {
    users: state.users.users,
    userId: state.auth.userId,
    sessionUser: state.users.user,
    requests: state.users.requests,
    follow: state.users.follow,
    followsMe: state.users.followsMe,
    followsActivities: state.users.followsActivities,
    followedLikes: state.users.followedLikes,
    myPostsComments: state.post.myPostsComments

  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAcceptInvitation: (userRequestID, sessionUser) => dispatch(acceptInvitation(userRequestID, sessionUser)),
    onStopFollowing: (stopFollowUser, sessionUser) => dispatch(stopFollowing(stopFollowUser, sessionUser)),
    onGetUser: (contactId) => dispatch(getUser(contactId)),
    onGetUserPromise: (contactId) => dispatch(getUserPromise(contactId)),
    onOpenComment: (sessionUserId, commentAuthorId, comments) =>
      dispatch(openComment(sessionUserId, commentAuthorId, comments)),
    onRejectRequest: (userRequest, sessionUser) => dispatch(rejectRequest(userRequest, sessionUser)),
    onRemoveInvitation: (userInvited, sessionUser) => dispatch(removeInvitation(userInvited, sessionUser)),
    onGetRequestsInfo: (sessionUser) => dispatch(getRequestsInfo(sessionUser))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PeopleIFollow);