import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	ImageBackground
} from 'react-native';
import { connect } from 'react-redux';
import { addPost } from '../../store/actions/index' 
import Button from '../../components/UI/Button';
import PickImage from '../../components/PickImage/PickImage';
import ImagePicker from "react-native-image-picker";

class GetPictureScreen extends Component {
	state = {
		controls:{
			image: {
				value: null,
				valid: false
			}
		}
	}
	constructor(props){
		super(props)
		
		this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
	};

	onNavigatorEvent = (event) => {
		if(event.type === 'ScreenChangedEvent'){
			if(event.id === 'willAppear'){
				ImagePicker.showImagePicker({title: "Pick an Image", maxWidth: 800, maxHeight: 800}, res => {
					if (res.didCancel) {
					console.log("User cancelled!");
					} else if (res.error) {
					console.log("Error", res.error);
					} else {
					this.imagePickerHandler({uri: res.uri, base64: res.data});
					}
				});
			}
		}
	}

	reset = () => {
		this.setState({
			controls:{
				image: {
					value: null,
					valid: false
				}
			}
		});
	};

	imagePickerHandler = (image) => {
		this.setState(prevState => {
			return {
				controls:{
					...prevState.controls,
					image:{
						value: image,
						valid: true
					},

				}
			}
		})
	};

	onDeletePostHandler = () => {
		this.reset();
	}

	onSubmitPostHandler = () => {
		if(this.state.controls.image.valid){
			this.props.onSubmitPost(
				this.state.controls.image.value,
				this.props.userId
				);
			this.reset();
			this.imagePicker.reset();
		}
	};

	render() {

		return (
			
				<View 
				style={styles.container}
				
				>
					<PickImage 
					onImagePicker={this.imagePickerHandler}
					ref={ref => (this.imagePicker = ref)}
					image={this.state.controls.image.valid ? this.state.controls.image.value : require('../../../assets/pickImage_picture.jpg')}
					/>
					<View
					style={{
					flexDirection:'row',
					width:'100%', 
					justifyContent:'space-evenly',
					alignItems:'center'}}
					>
						<Button 
						style={styles.buttonDelete}
						title="Delete"
						color="#fff" 
						onPress={this.onDeletePostHandler} 
						fontSize={18}
						radius={{borderRadius:20}}
						/>
						<Button 
						style={styles.buttonSubmit}
						title="Submit"
						color="#fff" 
						onPress={this.onSubmitPostHandler} 
						fontSize={18}
						radius={{borderRadius:20}}
						/>
					</View>
				</View>
			
			)
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#8E97FF',
		width: '100%',
		height: '100%',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'space-evenly'
	},
	buttonSubmit: {
		backgroundColor: '#48C9B0',
		borderColor: '#fff',
		borderWidth: 1,
		borderRadius: 20,
		width: 100,
		height:100,
		marginTop: 10,
		marginBottom: 30,
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#000',
		shadowOffset: {with:5, height:5},
		shadowOpacity: .7 
	},
	buttonDelete: {
		backgroundColor: 'purple',
		borderColor: '#fff',
		borderWidth: 1,
		borderRadius: 20,
		width: 100,
		height:100,
		marginTop: 10,
		marginBottom: 30,
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#000',
		shadowOffset: {with:5, height:5},
		shadowOpacity: .7 
	},

	postInput: {
		padding: 10,
		backgroundColor: '#fff',
		width: '90%',
		marginTop: 10
	}
});

const mapStateToProps = state => {
	return {
		userId: state.auth.userId,
		isLoading: state.ui.isLoading
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onSubmitPost: (image, userId) => dispatch(addPost(image,userId))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(GetPictureScreen);