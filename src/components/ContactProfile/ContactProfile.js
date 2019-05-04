import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  ActivityIndicator
} from 'react-native';
import Avatar from '../UI/Avatar';
import Button from '../UI/Button';
import Icon from 'react-native-vector-icons/Ionicons';

const ContactProfile = (props) => {

    let icon = (
      <Icon
        name={Platform.OS === "ios" ? "ios-add-circle-outline" : "md-add-circle-outline"}
        size={25}
        color="#48C9B0"
      />
    )

    if (props.isLoading) {
      icon = <ActivityIndicator />
    }

    return (
      <View style={styles.container}>
        <View style={styles.profileHeading}>
          <View
            style={{ flexDirection: 'row', alignItems: 'center', height: 120, width: '100%', flexDirection: 'row', justifyContent: 'center' }}
          >
            <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', }}>
              <Avatar
                style={styles.avatar}
                source={{ uri: props.user.avatar }}
              />
            </View>
            <View style={{ flex: 2, flexDirection: 'column', justifyContent: 'center' }}>
              <View style={styles.profileStatsBody}>
                <View style={styles.profileStats}>
                  <Text>{props.posts.length}</Text>
                  <Text style={{ color: '#aaa', fontSize: 11 }}>Post</Text>
                </View>
                <View style={styles.profileStats}>
                  <Text>{props.user.followsMe ? Object.values(props.user.followsMe).length : 0}</Text>
                  <Text style={{ color: '#aaa', fontSize: 11 }}>Follower</Text>
                </View>
                <View style={styles.profileStats}>
                  <Text>{props.user.follow ? Object.values(props.user.follow).length : 0}</Text>
                  <Text style={{ color: '#aaa', fontSize: 11 }}>Following</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start' }}>
                <Button
                  title='Send Message'
                  style={styles.button}
                  ios={{width:'50%'}}
                  fontSize={12}
                  color="#8E97FF"
                  onPress={props.openChat}
                />
                {props.followed ? 
                <TouchableOpacity
                onPress={props.stopFollow}
                >
                  <Icon
                    name={Platform.OS === 'android' ? 'md-person' : 'ios-person'}
                    color="#8E97FF"
                    size={26}
                  />
                </TouchableOpacity>
                :
                <TouchableOpacity
                onPress={props.startFollowing}
                >
                  <Icon
                    name={Platform.OS === 'android' ? 'md-person' : 'ios-person'}
                    color="#bbb"
                    size={26}
                  />
                </TouchableOpacity>
                }
              </View>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center', padding: 16 }}>
          <FlatList
            data={props.posts}
            numColumns={3}
            initialNumToRender={3}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={props.onPress(item)}
              >
                <Image
                  style={{ height: 110, width: 110, margin: 1 }}
                  source={item.image}
                />
              </TouchableOpacity>
            )}
            keyExtractor={item => item.key}
          />
        </View>
      </View>
    );

  }

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  profileHeading: {
    width: '100%',
    flexDirection: 'column',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1
  },
  profileStatsBody: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    height: 50
  },
  profileStats: {
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center'
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    zIndex: -1
  },
  changePictureIcon: {
    position: 'absolute',
    top: 62,
    left: 62,
    zIndex: 999
  },
  button: {
    borderColor: '#8E97FF',
    borderWidth: 1,
    borderRadius: 10,
    flex:3,
    paddingLeft: 3,
    paddingRight: 3,
    paddingTop: 3,
    paddingBottom: 3,
    marginRight: 10
  }
});


export default ContactProfile;