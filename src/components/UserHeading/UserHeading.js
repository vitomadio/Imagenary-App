import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Animated,
  Easing
} from 'react-native';
import Avatar from '../UI/Avatar';
import Icon from 'react-native-vector-icons/Ionicons';
import Button from '../UI/Button';
import withPreventDoubleClick from '../withPreventDoubleClick/withPreventDoubleClick';

const TouchableOpacityEx = withPreventDoubleClick(TouchableOpacity)

class FollowerHeading extends Component {

  constructor(props) {
    super(props);

    this.state = {
      spinValue: new Animated.Value(0),
      animatedClass:true
    }
  };

  componentDidMount(){
    Animated.loop(
    Animated.timing(
      this.state.spinValue,
      {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true
      }
    )).start()
    this.timeHandle = setTimeout(() => {
      Animated.loop(Animated.timing(this.state.spinValue)).stop();
      this.setState({animatedClass: false});
      this.timeHandle = 0;
    },4000)
  }

  componentWillUnmount(){
    if(this.timeHandle){
      clearTimeout(this.timeHandle);
      this.timeHandle = 0;
    }
  }

  //This function triggers either onOpenComments or openProfile.
  functionCombined(props){
    if(props.onOpenComments){
      return this.props.onOpenComments;
    }
    if(props.openProfile){
      return this.props.openProfile;
    }
  }

  render() {
    let {spinValue} = this.state;

    const spin = spinValue.interpolate({
      inputRange: [0,1],
      outputRange: ['0deg','360deg']
    })

    const content = (
      <View style={{justifyContent:'center', position:'relative'}}>
        <Animated.View
          style={{
            transform: [{rotate:spin}],
            backgroundColor: '#DA2E6B',
            height:56,
            width:56,
            borderRadius:28,
            overflow:'hidden',
            marginLeft: 2,
            justifyContent: 'center'
          }}
          >
        <View
        style={this.state.animatedClass ? styles.animatedTriangle : {display:'none'}}
        >
        </View>
        <View
        style={this.state.animatedClass ? [styles.animatedTriangle,{transform:[{rotate:'30deg'}]}]: {display:'none'}}
        >
        </View>
        <View
        style={this.state.animatedClass ? [styles.animatedTriangle,{transform:[{rotate:'60deg'}]}]: {display:'none'}}
        >
        </View>
        </Animated.View>
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
            <Text style={[styles.extraText,this.props.textStyle]}>{this.props.text}</Text>
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
            onRemoveFollower={this.props.onRemoveFollower}
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
  },
  animatedTriangle: {
    width: 0,
    height: 0,
    borderTopColor:'transparent',
    borderBottomColor:'transparent',
    borderRightColor:'#fff',
    borderTopWidth: 3,
    borderBottomWidth: 3,
    borderRightWidth: 45,
    position:'absolute',
    right:-2
  }
});

export default FollowerHeading;
