import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native';
import Avatar from '../UI/Avatar';
import Icon from 'react-native-vector-icons/Ionicons';
import Button from '../UI/Button';
import * as Animatable from 'react-native-animatable';
import withPreventDoubleClick from '../withPreventDoubleClick/withPreventDoubleClick';

const TouchableOpacityEx = withPreventDoubleClick(TouchableOpacity)

class FollowHeading extends Component {

  constructor(props) {
    super(props);
  };

  functionCombined(props){
    if(props.onOpenComments){
      return this.props.onOpenComments;
    }
    if(props.openProfile){
      return this.props.openProfile;
    }
  }

  render() {
    const content = (
      <View style={{justifyContent:'center', position:'relative'}}>
        <Animatable.View
          animation="rotate"
          iterationCount={5}
          easing="ease-out"
          style={{
            backgroundColor: 'purple',
            height:56,
            width:56,
            borderRadius:28,
            overflow:'hidden',
            marginLeft: 2,
            justifyContent: 'center'
          }}
          >
        <View
        style={{
          width: 0,
          height: 0,
          borderTopColor:'transparent',
          borderBottomColor:'transparent',
          borderRightColor:'#fff',
          borderTopWidth: 17,
          borderBottomWidth: 17,
          borderRightWidth: 40,
          position:'absolute',
          right:-1
        }}
        >
        </View>
        </Animatable.View>
        <Avatar
          style={[styles.avatar, {position: 'absolute', top:3, left: 2}]}
          source={{ uri: `${this.props.user.avatar}` }}
        />
      </View>
    );

    let icon2 = null;
    if (this.props.icon2) {
      icon2 = (
        <Icon
          style={{ marginLeft: 10 }}
          color={this.props.iconColor2}
          size={30}
          name={Platform.OS === "ios" ? `ios-${this.props.icon2}` : `md-${this.props.icon2}`}
        />
      )
    }

    return (
      <View style={styles.HeadingContainer}>
        <View style={styles.avatarContainer}>
          <TouchableOpacityEx
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={this.functionCombined(this.props)}
            onLongPress={this.props.onLongPress}
          >
            {this.props.message ?
              content :
              <View>
                <Avatar
                  style={styles.avatar}
                  source={{
                    uri: `${this.props.user.avatar ? this.props.user.avatar :
                      "https://gladstoneentertainment.com/wp-content/uploads/2018/05/avatar-placeholder.gif"}`
                  }}
                />
              </View>
            }
            <Text style={{ marginLeft: 5 }}>
              {this.props.user.username}
            </Text>
          </TouchableOpacityEx>
          {!this.props.title ?
            <Text style={styles.extraText}>{this.props.text}</Text>
            :
            <Button
              onPress={this.props.onFollow}
              title={this.props.title}
              style={[styles.button, this.props.buttonStyle]}
              color={this.props.buttonColor}
              fontSize={this.props.buttonTextSize}
            />
          }
        </View>

        {this.props.icon &&
        <View
          style={{ flexDirection: 'row' }}
        >
          <TouchableOpacityEx onPress={this.props.onPress}>
            <Icon
              color={this.props.iconColor}
              size={30}
              name={`ios-${this.props.icon}`}
            />
          </TouchableOpacityEx>
          <TouchableOpacityEx
            onPress={this.props.onRejectRequest}
          >
            {icon2}
          </TouchableOpacityEx>
        </View>
        }

      </View>
    );
  }
};

const styles = StyleSheet.create({
  HeadingContainer: {
    height: 60,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  avatarContainer: {
    width: '80%',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginLeft:3,
    
  },
  extraText: {
    marginLeft: 10,
    fontSize: 12,
    color: '#48C9B0'
  }
});

export default FollowHeading;
