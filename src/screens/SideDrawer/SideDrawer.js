import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Platform,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { authLogout } from '../../store/actions/index';

class SideDrawer extends Component {

	onLogoutHandler = () => {
		this.props.onAuthLogout();
	};

	onSavedElementsHandler = () => {
		this.props.navigator.showModal({
        screen: 'insta-like.ElementsSavedScreen',
        title: 'Saved Posts',
        animationType: 'slide-up',
        navigatorButtons: {
            rightButtons: [
                {
                    title:'Close',
                    id: "close"
                }
            ]
        },
        navigatorStyle: {
              navBarButtonColor: '#fff'
            }
      });
	};

  	render() {
	    return (
	      <View style={[styles.container,
	      	{ width: Dimensions.get("window").width * 0.8},
	      	Platform.OS === 'android' ? {paddingTop:20} : {paddingTop:50}]
	      }>
	      	<TouchableOpacity
	      	onPress={this.onLogoutHandler}
	      	>
	      		<View style={styles.item}>	
	            	<Icon 
	            	name={Platform.OS === 'android' ? 'md-log-out' : 'ios-log-out'}
	            	color="#aaa"
	            	size={30}
	            	style={{marginLeft:16}}
	            	/>
	      			<Text style={styles.text}>Logout</Text>
	            </View>
	        </TouchableOpacity>
	        <TouchableOpacity
	      	>
	            <View 
	            style={styles.item}
	            >	
	            	<Icon 
	            	name={Platform.OS === 'android' ? 'md-settings' : 'ios-settings'}
	            	color="#aaa"
	            	size={30}
	            	style={{marginLeft:16}}
	            	/>
	      			<Text style={styles.text}>Settings</Text>
	            </View>
	        </TouchableOpacity>
	         <TouchableOpacity
	      	onPress={this.onSavedElementsHandler}
	      	>
	            <View 
	            style={styles.item}
	            >	
	            	<Icon 
	            	name={Platform.OS === 'android' ? 'md-bookmark' : 'ios-bookmark'}
	            	color="#aaa"
	            	size={30}
	            	style={{marginLeft:19}}
	            	/>
	      			<Text style={styles.text}>Saved Posts</Text>
	            </View>
	        </TouchableOpacity>
	      </View>
	    );
  	}
}

const styles = StyleSheet.create({
	container: {
		height: '100%',
		width: '100%',
		backgroundColor: '#fff', 
		flex: 1
	},
	item: {
		flexDirection: 'row',
		alignItems: 'center',
		width: '100%',
		marginTop:8,
		paddingBottom:8,
		borderStyle:'solid',
		borderBottomWidth:1,
		borderBottomColor:"#ddd",

	},
	text: {
		marginLeft: 10,
		fontSize: 16,
		color: '#aaa'
	}
});

const mapDispatchToProps = dispatch => {
	return {
		onAuthLogout: () => dispatch(authLogout())
	};
};


export default connect(null, mapDispatchToProps)(SideDrawer);