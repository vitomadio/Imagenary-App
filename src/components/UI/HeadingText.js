import React from 'react';
import {
  Text,
  StyleSheet
} from 'react-native';

const HeadingText = (props) => (
      <Text style={[styles.text, {color: props.color}, props.style]}>
      	{props.title}
      </Text>
    );

const styles = StyleSheet.create({
	text: {
		fontSize: 36,
		fontWeight: 'bold'
	}
});

export default HeadingText;