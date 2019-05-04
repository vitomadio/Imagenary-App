import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Text,
  ImageBackground,
  Image,
  ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import Avatar from '../../components/UI/Avatar';
import {
  getUser,
  openComment,
  getMyPosts,
} from '../../store/actions';
import withPreventDoubleClick from '../../components/withPreventDoubleClick/withPreventDoubleClick';

const TouchableOpacityEx = withPreventDoubleClick(TouchableOpacity)

class FollowersListScreen extends Component {

  state = {
    animationOn: false,
    commentOpen: false,
  };

  constructor(props) {
    super(props);
    this.props.navigator.addOnNavigatorEvent(this.onNavigatorEvent);
  };

  onNavigatorEvent = event => {
    if (event.type === 'ScreenChangedEvent') {
      if (event.id === 'willAppear') {
        const comments = this.props.sessionUser.comments || [];
        const newComments = comments.filter(comment => {
          return !comment.seen
        })
        this.setState(prevState => {
          return {
            ...prevState,
            animationOn: newComments.length >= 1 ? true : false
          }
        });
      }
    };
  };

  //Open contact profile.
  openContactProfile = (item) => {
    // this.props.onGetUser(item.key);
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
  //Open post details.
  onSelectPostHandler = (item, e) => {
    const post = {
      userId: item.userId,
      image: { uri: item.image },
      key: item.key,
      comments: item.comments,
      likes: item.likes
    }
    this.props.navigator.push({
      screen: 'insta-like.PostDetailScreen',
      title: 'Post Details',
      navigatorStyle: {
        navBarButtonColor: '#fff'
      },
      passProps: {
        post: post
      }
    })
  };

  //Go to user chat when avatar is pressed.
  openContactCommentHandler = (item) => {
    this.props.onOpenComment(this.props.sessionUser)
    this.props.onGetUser(item.author);
    this.props.onGetMyPosts(this.props.sessionUser);
    this.props.navigator.showModal({
      screen: 'insta-like.CommentsScreen',
      title: `${item.username} Comments`,
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

  isThisMonth = (date) => {
    const dateNow = Date.now();
    const actualMonth = new Date(dateNow).getMonth();
    const d = new Date(date);
    const month = d.getMonth();
    const year = d.getYear();
    if (month + year == actualMonth + year) {
      return true
    }
    return false
  }

  render() {
    const { sessionUser, requests, myPosts, myPostsComments } = this.props
    const followers = this.props.followsMe;
    const contacts = this.props.follow;
    const followedLikes = this.props.followedLikes;
    const myPostsLikes = followedLikes.filter(like => like.post.userId === sessionUser.key);

    //Set comments.
    const comments = [];
    myPostsComments.map(comment => {
      contacts.map(contact => {
        if (comment.author !== sessionUser.key && comment.author === contact.key) {
          return comments.push({ ...comment, avatar: contact.avatar, username: contact.username, event: 'comment' })
        }
      })
    })

    //Set start to follows me event.
    const followsMeEvent = [];
    followers.map(follower => {
      Object.values(follower.follow).map(followed => {
        if (followed.key === this.props.sessionUser.key) {
          followsMeEvent.push({ ...follower, date: followed.date, event: 'follow' })
        }
      })
    })

    //Split comments by date.
    const actualComments = comments.filter(comment => this.isThisMonth(comment.date));
    const previousComments = comments.filter(comment => !this.isThisMonth(comment.date));

    //Split follow events by date.
    const actualFollowsEvent = followsMeEvent.filter(followsMe => this.isThisMonth(followsMe.date));
    const previousFollowsEvent = followsMeEvent.filter(followsMe => !this.isThisMonth(followsMe.date));

    const actualfollowersLikes = myPostsLikes.filter(item => this.isThisMonth(item.date));
    const previousFollowersLikes = myPostsLikes.filter(item => !this.isThisMonth(item.date));

    //Order Actual Activity by date Desc.
    const actualActivities = actualfollowersLikes.concat(actualComments).sort((a, b) => {
      a = new Date(a.date);
      b = new Date(b.date);
      return a > b ? -1 : a < b ? 1 : 0;
    });

    //Order Previous Activity by date Desc.
    const previousActivities = previousFollowsEvent.concat(previousFollowersLikes).concat(previousComments).sort((a, b) => {
      a = new Date(a.date);
      b = new Date(b.date);
      return a > b ? -1 : a < b ? 1 : 0;
    });

    console.log(actualActivities);
    return (
      <ScrollView style={styles.viewsContainer}>
        {requests.length >= 1 ?
          <TouchableOpacityEx style={{ flexDirection: 'row' }}
            onPress={this.openFollowRequests}
          >
            <ImageBackground
              style={styles.requestsQty}>
              <Text style={{ position: 'absolute', color: '#fff', fontSize: 10 }}>{requests.length}</Text>
            </ImageBackground>

            <Avatar
              style={styles.avatar}
              source={{ uri: requests[requests.length - 1].avatar }}
            />

            <View style={{ justifyContent: 'center' }}>
              <Text style={{ fontSize: 13, fontWeight: 'bold' }}>{"Requests to follow you"}</Text>
              <Text style={{ fontSize: 12 }}>{"Approve or ignore requests"}</Text>
            </View>
          </TouchableOpacityEx>
          : null}

        {actualActivities.length >= 1 &&
          <View>
            <Text style={{ marginLeft: 10, marginBottom: actualFollowsEvent.length >= 1 ? 8 : 0, fontWeight: 'bold' }}>{"This month"}</Text>
            {actualFollowsEvent.length >= 1 &&
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {actualFollowsEvent.length > 1 ?
                  <View style={{ position: 'relative' }}>
                    <Avatar
                      style={styles.avatar}
                      source={{ uri: actualFollowsEvent[1].avatar }}
                    />
                    <View style={{
                      width: 44,
                      height: 44,
                      justifyContent: 'center',
                      alignItems: 'center',
                      position: 'absolute',
                      left: 10,
                      top: 7,
                      backgroundColor: '#fff',
                      borderRadius: 22
                    }}>
                      <Avatar
                        style={[styles.avatar, { position: 'absolute', left: 2 }]}
                        source={{ uri: actualFollowsEvent[0].avatar }}
                      />
                    </View>
                  </View>
                  :
                  <View>
                    <Avatar
                      style={styles.avatar}
                      source={{ uri: actualFollowsEvent[0].avatar }}
                    />
                  </View>
                }
                <View>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontSize: 13, marginLeft: 10, fontWeight: 'bold' }}>
                      {actualFollowsEvent.length > 1 ?
                        actualFollowsEvent[0].username + ', ' + actualFollowsEvent[1].username
                        : actualFollowsEvent[0].username}
                    </Text>
                    {actualFollowsEvent.length > 2 &&
                      <Text style={{ fontSize: 12, marginLeft: 5 }}>{`and other ${actualFollowsEvent.length - 2} people`}</Text>
                    }
                  </View>
                  <Text style={{ fontSize: 12, marginLeft: 10 }}>{`started to following you.`}
                  </Text>
                </View>
              </View>
            }
            <View style={{ flexDirection: 'row' }}>
              <View style={{ marginTop: actualFollowsEvent.length >= 1 ? 8 : 8 }}>
                <FlatList
                  extraData={myPosts}
                  data={actualActivities}
                  renderItem={({ item }) => (
                    <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                      {item.event === 'like' ?
                        <TouchableOpacityEx
                          onPress={null}
                          style={{ flexDirection: 'row', alignItems: 'center' }}
                        >
                          <Avatar
                            style={[styles.avatar, { marginBottom: 8 }]}
                            source={{ uri: item.followed.avatar }}
                          />
                          <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 13, fontWeight: 'bold' }}>{item.username || item.followed.username}</Text>
                            <Text style={{ fontSize: 12 }}>{' Liked your post'}</Text>
                          </View>
                        </TouchableOpacityEx>
                        :
                        <TouchableOpacityEx
                          onPress={item.event === 'comment' ? this.openContactCommentHandler.bind(this, item) : null}
                          style={{ flexDirection: 'row', alignItems: 'center' }}
                        >
                          <Avatar
                            style={[styles.avatar, { marginBottom: 8 }]}
                            source={{ uri: item.avatar }}
                          />
                          <View>
                            <View style={{ flexDirection: 'row' }}>
                              <Text style={{ fontSize: 13, fontWeight: 'bold' }}>{item.username}</Text>
                              <Text style={{ fontSize: 12 }}>{' Commented your post '}</Text>
                            </View>
                            <Text style={{ fontSize: 12 }}>{item.comment.slice(0, 10) + '...'}</Text>
                          </View>
                        </TouchableOpacityEx>
                      }
                      <View>
                        {item.event === 'like' ?
                          <TouchableOpacityEx onPress={this.onSelectPostHandler.bind(this, item.post)}>
                            <Image
                              style={{ height: 35, width: 35 }}
                              source={{ uri: item.post.image }}
                            />
                          </TouchableOpacityEx>
                          :
                          item.event === 'comment' ?
                          <TouchableOpacityEx onPress={this.onSelectPostHandler.bind(this, myPosts.filter(post => post.key === item.postId)[0])}>
                            <Image
                              style={{ height: 35, width: 35 }}
                              source={{ uri: myPosts.filter(post => post.key === item.postId)[0].image }}
                            />
                          </TouchableOpacityEx>
                          : null
                        }
                      </View>
                    </View>
                  )}
                  keyExtractor={(item, i) => item + i}
                />
              </View>
            </View>
          </View>
        }
        {previousActivities.length >= 1 &&
          <View style={{ width: '100%' }}>
            <Text style={{ marginLeft: 10, marginBottom: 8, fontWeight: 'bold' }}>{"Previous"}</Text>
            <FlatList
              data={previousActivities}
              renderItem={({ item }) => (
                <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                  {item.event === 'like' ?
                    <TouchableOpacityEx
                      onPress={null}
                      style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                      <Avatar
                        style={[styles.avatar, { marginBottom: 8 }]}
                        source={{ uri: item.followed.avatar }}
                      />
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: 13, fontWeight: 'bold' }}>{item.username || item.followed.username}</Text>
                        <Text style={{ fontSize: 12 }}>{' Liked your post'}</Text>
                      </View>
                    </TouchableOpacityEx> :
                    item.event === 'follow' ?
                      <TouchableOpacityEx
                        onPress={null}
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                      >
                        <Avatar
                          style={[styles.avatar, { marginBottom: 8 }]}
                          source={{ uri: item.avatar }}
                        />
                        <View style={{ flexDirection: 'row' }}>
                          <Text style={{ fontSize: 13, fontWeight: 'bold' }}>{item.username}</Text>
                          <Text style={{ fontSize: 12, marginLeft: 10 }}>{`started to following you.`}</Text>
                        </View>
                      </TouchableOpacityEx>
                      :
                      <TouchableOpacityEx
                        onPress={item.event === 'comment' ? this.openContactCommentHandler.bind(this, item) : null}
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                      >
                        <Avatar
                          style={[styles.avatar, { marginBottom: 8 }]}
                          source={{ uri: item.avatar }}
                        />
                        <View>
                          <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 13, fontWeight: 'bold' }}>{item.username}</Text>
                            <Text style={{ fontSize: 12 }}>{' Commented your post '}</Text>
                          </View>
                          <Text style={{ fontSize: 12 }}>{item.comment.slice(0, 10) + '...'}</Text>
                        </View>
                      </TouchableOpacityEx>
                  }
                  <View>
                    {item.event === 'like' ?
                      <TouchableOpacityEx onPress={this.onSelectPostHandler.bind(this, item.post)}>
                        <Image
                          style={{ height: 35, width: 35 }}
                          source={{ uri: item.post.image }}
                        />
                      </TouchableOpacityEx>
                      :
                      item.event === 'comment' ?
                        <TouchableOpacityEx onPress={this.onSelectPostHandler.bind(this, myPosts.filter(post => post.key === item.postId)[0])}>
                          <Image
                            style={{ height: 35, width: 35 }}
                            source={{ uri: myPosts.filter(post => post.key === item.postId)[0].image }}
                          />
                        </TouchableOpacityEx>
                        : null
                    }
                  </View>
                </View>
              )}
              keyExtractor={(item, i) => item + i}
            />
          </View>
        }
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  flatList: {
    width: '100%',
    padding: 10,
    paddingRight: 20,
  },
  viewsContainer: {
    backgroundColor: '#fff',
    height: '100%',
    width: '100%',
    padding: 10,
    paddingBottom: 0
  },
  buttonContainer: {
    borderColor: '#8E97FF',
    borderWidth: 1,
    borderRadius: 30,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    marginRight: 15,
    paddingBottom: 5
  },
  buttonText: {
    fontSize: 12
  },
  avatar: {
    height: 46,
    width: 46,
    marginRight: 10,
    borderRadius: 23
  },
  requestsQty: {
    height: 15,
    width: 15,
    left: 50,
    top: 10,
    position: 'absolute',
    backgroundColor: '#DA2E6B',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999
  }
});

const mapStateToProps = state => {
  return {
    userId: state.auth.userId,
    sessionUser: state.users.user,
    requests: state.users.requests,
    follow: state.users.follow,
    followsMe: state.users.followsMe,
    users: state.users.users,
    followedLikes: state.users.followedLikes,
    myPosts: state.post.myPosts,
    myPostsComments: state.post.myPostsComments
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetUser: (userId) => dispatch(getUser(userId)),
    onOpenComment: (sessionUser) =>
      dispatch(openComment(sessionUser)),
    onGetMyPosts: (sessionUser) => dispatch(getMyPosts(sessionUser))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FollowersListScreen);