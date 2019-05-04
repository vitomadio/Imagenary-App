import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

const floatingIndicator = (props) => (
    <TouchableOpacity>
      <View style={styles.container}/>
    </TouchableOpacity>
    )

const styles = StyleSheet.create({
	container:{
		width:15,
		height:15,
		backgroundColor:'#FF1C5B',
		borderRadius:20,
		position:'absolute',
		top:20,
		right: 20 
	}
});

export default floatingIndicator;