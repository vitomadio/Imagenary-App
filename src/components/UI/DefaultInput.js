import React from 'react';
import {
  TextInput,
  StyleSheet
} from 'react-native';

const defaultInput = (props) => (
      <TextInput 
        {...props}
      	style={[styles.container, props.style, !props.valid && props.touched ? styles.invalid : null]}
        underlineColorAndroid="transparent"
        onChange={props.onChangeText}
      />
    );

const styles = StyleSheet.create({
	container: {
    alignItems: 'center',
    flexDirection: 'column',
		padding: 10,
    color: '#000'
	},
    invalid: {
    backgroundColor: '#f9c0c0'
  }
});

export default defaultInput;