import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  FlatList
} from 'react-native';
import { connect } from 'react-redux';
import DefaultInput from '../../components/UI/DefaultInput';
import Icon from 'react-native-vector-icons/Ionicons';
import { addComment } from '../../store/actions';
import Avatar from '../../components/UI/Avatar';

class WriteCommentScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      comment: ""
    };

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  onNavigatorEvent = (event) => {
    if(event.type === 'NavBarButtonPress'){
      if(event.id === 'close'){
        this.props.navigator.dismissModal({
          animationType: 'slide-down'
        });
      };
    };
  };
  
  //Change comment state while writing.
  onChangeTextHandler = (value) => {
    this.setState(prevState => {
      return {
        ...prevState,
        comment: value
      }
    });
  };
  //Submit comment
  onSubmitCommentHandler = () => {
    if (this.state.comment !== ""){
      this.props.submitComment(
        this.state.comment,
        this.props.sessionUser,
        this.props.post
      )
      this.setState(prevState => {
        return {
          ...prevState,
          comment: ""
        }
      });
      this.props.navigator.dismissModal({
        animationType: 'slide-down'
      })
    }
  };

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

    const postComments = this.props.postComments;
    console.log(postComments);
    return (
      <View style={styles.container}>
        <View style={styles.topView}>
          <FlatList
            data={postComments}
            renderItem={({ item }) => (
              <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Avatar
                    style={styles.avatar}
                    source={{ uri: item.author.avatar }}
                  />
                  <View>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={{ marginLeft: 8, fontWeight: 'bold' }}>{item.author.username}</Text>
                      <Text style={{ marginLeft: 8 }}>{item.message}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={{ fontSize: 11 , marginLeft: 8, color: '#777'}}>{this.timeLogicUtility(item.date)}</Text>
                      <Text style={{ fontSize: 11 , marginLeft: 10, color: '#999', fontWeight: 'bold'}}>{'Likes to x people'}</Text>
                      <Text style={{ fontSize: 11 , marginLeft: 10, color: '#999', }}>{'Reply'}</Text>
                    </View>
                  </View>
                </View>
                <Icon
                  style={{ marginRight: 5 }}
                  name={Platform.OS === 'android' ? 'md-heart-empty' : 'ios-heart-empty'}
                  size={16}
                  color="#555"
                />
              </View>
            )}
            keyExtractor={item => item.key}
          />
        </View>
        <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', backgroundColor: '#8E97FF', padding: 10 }}>
          <DefaultInput
            style={styles.input}
            placeholder="Write a comment"
            onChangeText={this.onChangeTextHandler}
            value={this.state.comment}
            spellCheck={false}
          />
          <TouchableOpacity
            style={{
              backgroundColor: 'purple',
              width: 50,
              height: 50,
              borderRadius: 50,
              alignItems: 'center',
              jsutifyContent: 'center',
              marginLeft: 7,
              padding: 10
            }}
            onPress={this.onSubmitCommentHandler}
          >
            <Icon
              name={Platform.OS === "ios" ? "ios-add" : "md-add"}
              color="#fff"
              size={30}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff'
  },
  topView: {
    flexGrow: 1,
    width: '100%'
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25
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
});

const mapStateToProps = state => {
  return {
    postComments: state.post.postComments,
    post: state.post.post,
    sessionUser: state.users.user,
    users: state.users.users
  }
}

const mapDispatchToProps = dispatch => {
  return {
    submitComment: (comment, sessionUser, post) => dispatch(addComment(comment, sessionUser, post))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WriteCommentScreen);