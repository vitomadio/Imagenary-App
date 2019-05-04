import React, { Component } from "react";
import { 
  View,
  Image,
  StyleSheet,
  TouchableOpacity 
  } from "react-native";
import ImagePicker from "react-native-image-picker";

class PickImage extends Component {

  state = {
    pickedImage: null
  }

  reset = () => {
    this.setState({
      pickedImage: null
    });
  }

  pickImageHandler = () => {
    ImagePicker.showImagePicker({title: "Pick an Image", maxWidth: 800, maxHeight: 800}, res => {
      if (res.didCancel) {
        console.log("User cancelled!");
      } else if (res.error) {
        console.log("Error", res.error);
      } else {
        this.setState({
          pickedImage: { uri: res.uri }
        });
        this.props.onImagePicker({uri: res.uri, base64: res.data});
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity 
        style={styles.placeholder}
        onPress={this.pickImageHandler} 
        >
          <Image 
          source={this.state.pickedImage ? this.state.pickedImage : this.props.image } 
          style={styles.previewImage} />
        </TouchableOpacity> 
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: { 
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center'
    },
    placeholder: {
      borderColor: '#fff',
      borderWidth: 1,
      borderRadius: 12,
      backgroundColor: 'transparent',
      width: '90%',
      height: 275,
      padding: 5
    },
    previewImage: {
        width: '100%',
        height: '100%',
        borderRadius: 10
    },
    button: {
      borderColor: '#fff',
      borderWidth: 1,
      width: '90%',
      fontSize: 18,
      marginTop: 10
    },
  });

export default PickImage;
