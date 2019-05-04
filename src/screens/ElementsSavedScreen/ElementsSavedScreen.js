import React, {Component} from 'react';
import {
	View,
	StyleSheet,
	Image,
	FlatList,
	ScrollView,
	Dimensions,
	TouchableOpacity
} from 'react-native';
import {connect} from 'react-redux';

class ElementsSavedScreen extends Component {

	constructor(props){
		super(props)
		this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
	}

	onNavigatorEvent = event => {
		if(event.type === 'NavBarButtonPress'){
			if(event.id === 'close'){
				this.props.navigator.dismissModal({
					animationType: 'slide-down'
				})
			}
		}
	}

	render() {
		const posts = this.props.sessionUser.savedElements.map(item => {
			return item.post
		});
		const width = Dimensions.get('window').width;
	    return (
	        <View style={styles.container}>
	        <ScrollView
	        contentContainerStyle={styles.contentContainerStyle}
	        >
	        <FlatList
			data={posts}
			numColumns={3}
			initialNumToRender={3}
			renderItem={({item, index}) => (
				<TouchableOpacity>
				<Image
				style={{width:(width/3)-4,height:(width/3)-4,marginRight:(index+3)%3 === null ? 0 : 1}}
				source={item.image} 
				/>
				</TouchableOpacity>
			)}
			keyExtractor={item => item.key}
	        />
	        </ScrollView>
	        </View>
	    );

	}
};

const styles = StyleSheet.create({
	container: {
		width:'100%',
		height:'100%',
		backgroundColor:'#fff'
	},
	contentContainerStyle: {
		width:'100%',
		height: '100%',
		paddingTop:10,
		paddingBottom:10,
		paddingLeft:4,
		paddingRight:4
	},
	listItem:{
		display: 'flex',
		alignItems: 'center'
	},
	image: {
		width:'30%',
		height:'auto',
		borderRadius:5,
		margin:2
	}
})

const mapStateToProps = state => {
	return {
		sessionUser: state.users.user
	}
}

export default connect(mapStateToProps, null)(ElementsSavedScreen);
