import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  Platform,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Dimensions
} from 'react-native';
import { connect } from 'react-redux';
import { addChat, getChat, fetchMessagesByTen } from '../../store/actions/index';
import DefaultInput from '../../components/UI/DefaultInput';
import Icon from 'react-native-vector-icons/Ionicons';
import withPreventDoubleClick from '../../components/withPreventDoubleClick/withPreventDoubleClick';

const TouchableOpacityEx = withPreventDoubleClick(TouchableOpacity)

class ContactChatScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      lastMessageKey: null,
      onBottom: false,
      loadPreviousMsgs: true,
      refreshing: false
    };

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  fetchPreviousMessages = (e) => {
    const chats = this.props.chats
    this.setState({
      onBottom: true,
      loadPreviousMsgs: true,
      refreshing: true
    }, () => {
      if (this.state.loadPreviousMsgs == true) {
        this.props.fetchPreviousMessagesByTen(this.props.sessionUser, this.props.author, chats[0].key)
          .then(() => {
            this.setState({
              loadPreviousMsgs: false,
              refreshing: false
            });
          })
      }
    });
  }

  onNavigatorEvent = event => {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'close') {
        this.props.navigator.dismissModal({
          animationType: 'slide-down'
        })
      }
    }
    if (event.type === 'ScreenChangedEvent') {
      if (event.id === 'willAppear') {
        this.setState({ onBottom: false })
      }
    }
  }

  onChangeTextHandler = (value) => {
    this.setState(prevState => {
      return {
        ...prevState,
        message: value,
        onBottom: false
      }
    });
  };
  //Send message.
  onSubmitChatHandler = () => {
    this.props.submitChat(
      this.state.message,
      this.props.sessionUser,
      this.props.author
    )
    this.setState(prevState => {
      return {
        ...prevState,
        message: "",
        onBottom: false
      }
    });
  };

  onGateHour = (date) => {
    let h = new Date(date);
    let hour = h.getHours();
    let mins = h.getMinutes();
    return `${hour}:${mins < 10 ? '0' + mins : mins}`;
  }

  onGetDate = (date) => {
    let d = new Date(date);
    let day = d.getDate();
    let month = d.getMonth();
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December']
    return `${months[month]} ${day}`;
  }

  render() {
    const chats = this.props.chats;
    const width = Dimensions.get('window').width;
    return (
      <View style={styles.container}>
        <KeyboardAvoidingView>
          <FlatList
            ref={ref => this.scrollView = ref}
            refreshing={this.state.refreshing}
            onContentSizeChange={(contentWidth, contentHeight) => {
              if (this.state.onBottom === false) {
                this.scrollView.scrollToEnd()
              }
            }}
            onRefresh={this.fetchPreviousMessages}
            style={{ backgroundColor: '#fff', paddingLeft: 5, paddingRight: 10, paddingBottom: 20, height: '100%' }}
            extraData={chats}
            data={chats}
            renderItem={({ item }) => (
              <View>
                {
                  chats.map((chat, i) => {
                    if (i >= 1) {
                      if (item.date == chats[i].date) {
                        if (this.onGetDate(item.date) !== (this.onGetDate(chats[i - 1].date))) {
                          return (
                            <View key={i} style={{ width: '100%', flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                              <Text style={{ backgroundColor: '#aaa', padding: 6, margin: 3, color: '#fff', borderRadius: 4 }}>{this.onGetDate(item.date)}</Text>
                            </View>
                          )
                        }
                      }
                    }
                    else if (item.date == chats[0].date) {
                      return (
                        <View key={i} style={{ width: '100%', flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                          <Text style={{ backgroundColor: '#aaa', padding: 6, margin: 3, color: '#fff', borderRadius: 4 }}>{this.onGetDate(item.date)}</Text>
                        </View>
                      )
                    }
                  })
                }
                {item.post &&
                  <View style={[styles.commentContainer, { justifyContent: item.sender === item.chatWith ? 'flex-start' : 'flex-end' }]}>
                    <Image
                      style={[styles.image, { height: width * 0.75 }]}
                      source={item.post.image}
                    />
                  </View>
                }
                {item.message &&
                  <View style={[styles.commentContainer, { justifyContent: item.sender === item.chatWith ? 'flex-start' : 'flex-end' }]}>
                    {item.sender === item.chatWith &&
                      <Image
                        style={{ width: 50, height: 50, borderRadius: 25, left: 10 }}
                        source={{ uri: this.props.author.avatar }}
                      />
                    }
                    <View style={item.sender === item.chatWith ? styles.textRecipient : styles.text}>
                      <Text style={{ color: '#555', maxWidth: '82%' }}>{item.message}</Text>
                      <Text style={{ color: '#777', fontSize: 9, marginLeft: 8, maxWidth: '27%', minWidth: 25 }}>{this.onGateHour(item.date)}</Text>
                      {Platform.OS === 'android' &&
                        <View style={item.sender === item.chatWith ? styles.arrowLeft : styles.arrowRight}></View>
                      }
                    </View>
                    <View style={item.sender === item.chatWith ? styles.arrowLeft : styles.arrowRight}></View>
                  </View>
                }
              </View>
            )}
            keyExtractor={item => item.key}
          />

          <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', padding: 15, justifyContent: 'center', backgroundColor: '#8E97FF' }}>
            <DefaultInput
              style={styles.input}
              placeholder="Write a message"
              onChangeText={this.onChangeTextHandler.bind(this)}
              value={this.state.message}
              spellCheck={false}
            />
            <TouchableOpacityEx
              style={{
                backgroundColor: 'purple',
                width: 50,
                height: 50,
                borderRadius: 50,
                alignItems: 'center',
                jsutifyContent: 'center',
                marginLeft: 10,
                padding: 10
              }}
              onPress={this.onSubmitChatHandler}
            >
              <Icon
                name={Platform.OS === "ios" ? "ios-add" : "md-add"}
                color="#fff"
                size={30}
              />
            </TouchableOpacityEx>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    paddingTop: 5
  },
  input: {
    width: '82%',
    borderColor: '#aaa',
    borderRadius: 50,
    borderWidth: .75,
    padding: 10,
    paddingLeft: 15,
    backgroundColor: '#fff'
  },
  image: {
    width: '80%',
    margin: 5,
    marginBottom: 10,
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 3,
  },
  commentContainer: {
    display: "flex",
    flexDirection: 'row',
    width: '100%',
    marginTop: 2,
    marginBottom: 5,
    right: 6,
    position: 'relative'
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 41
  },
  text: {
    overflow: 'visible',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C8EEE7',
    maxWidth: '90%',
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 5,
    paddingLeft: 10,
    marginTop: 5,
    borderTopLeftRadius: 5,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    zIndex: 0,
    position: 'relative'
  },
  textRecipient: {
    display: "flex",
    flexDirection: 'row',
    backgroundColor: '#f4e277',
    alignItems: 'center',
    maxWidth: '80%',
    paddingTop: 8,
    paddingBottom: 8,
    padding: 10,
    marginTop: 5,
    left: 25,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    position: 'relative',
    zIndex: 0
  },
  arrowRight: {
    height: 0,
    width: 0,
    borderStyle: 'solid',
    borderTopWidth: 12,
    borderRightWidth: 12,
    borderBottomWidth: 12,
    borderTopColor: '#C8EEE7',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    position: 'absolute',
    top: 5,
    right: -6,
    zIndex: 2
  },
  arrowLeft: {
    height: 0,
    width: 0,
    borderTopWidth: 12,
    borderLeftWidth: 12,
    borderBottomWidth: 12,
    borderStyle: 'solid',
    borderTopColor: '#f4e277',
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    position: 'absolute',
    top: 5,
    left: 69,
    zIndex: 3
  },
});

const mapStateToProps = state => {
  return {
    userId: state.auth.userId,
    sessionUser: state.users.user,
    posts: state.post.posts,
    users: state.users.users,
    chats: state.chat.chat,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    submitChat: (message, sessionUser, recipient) => dispatch(addChat(message, sessionUser, recipient)),
    getChat: (sessionUser, recipient) => dispatch(getChat(sessionUser, recipient)),
    fetchPreviousMessagesByTen: (sessionUser, recipient, chatKey) => dispatch(fetchMessagesByTen(sessionUser, recipient, chatKey))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ContactChatScreen);