import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  TouchableNativeFeedback
} from 'react-native';

const button = (props) => {

  const content = (
    <View 
      style={[styles.container,props.style]}
      >
      <Text 
      style={[styles.text,{color:props.color,fontSize:props.fontSize}]}
      textDecorationLine={props.textDecorationLine}
      >
        {props.title}   
      </Text>
    </View>
    );


    if (Platform.OS === 'android') {
      return (
        <View style={props.tnf}>
        <TouchableNativeFeedback 
        onPress={props.onPress}
        background={TouchableNativeFeedback.Ripple('#AAF', true)}
          >
          {content}
        </TouchableNativeFeedback>
        </View>
        )
    }
    return (
        <View style={props.ios}>
        <TouchableOpacity
        style={[{flexDirection:'row',justifyContent:'flex-start'},props.tnf]}
        onPress={props.onPress}
         >
         {content}
        </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
	container: {
		paddingLeft: 20,
		paddingRight: 20,
		paddingTop: 10,
		paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'center'
	},
  text: {
    fontSize: 16
  },
  ios: {
    width: '100%',
    alignItems: 'center'
  }
});

export default button;