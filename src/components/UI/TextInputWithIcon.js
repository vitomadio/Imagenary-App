import React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const textInputWithIcon = (props) => (
      <View style={[styles.container,props.style]}>
		    <Icon 
		    style={styles.searchIcon} 
		    name={Platform.OS === "ios" ? "ios-search" : "md-search"}
		    size={25} 
		    color="#bbb"
		    />
		    <TextInput
		    	{...props}
		        style={styles.input}
		        onChangeText={props.onChangeText}
		        underlineColorAndroid="transparent"
		    />
		</View>
    );


const styles = StyleSheet.create({
	container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
	},
	searchIcon: {
	    padding: 10
	},
	input: {
    flex: 1,
    paddingTop: 5,
    paddingRight: 10,
    paddingBottom: 5,
    paddingLeft: 0,
    backgroundColor: 'transparent',
    color: '#424242',
    fontSize: 16
	},
});

export default textInputWithIcon;