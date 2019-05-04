import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  TextInput,
  ImageBackground,
  Platform
} from 'react-native';
import { connect } from 'react-redux';
import Button from '../../components/UI/Button';
import HeadingText from '../../components/UI/HeadingText';
import DefaultInput from '../../components/UI/DefaultInput';
import startTabs from '../MainTabs/StartMainTabs';
import validate from '../../utility/validations';
import { authSubmit, authAutoSignIn } from '../../store/actions/index';

class AuthScreen extends Component {

  state = {
    authMode: "login",
    controls: {
      username: {
        value: "",
        valid: false,
        validationRules: {
          notEmpty: true
        },
        touched: false,
      },
      email: {
        value: "",
        valid: false,
        validationRules: {
          isEmail: true
        },
        touched: false
      },
      password: {
        value: "",
        valid: false,
        validationRules: {
          minLength: 6
        },
        touched: false
      },
      confirmPassword: {
        value: "",
        valid: false,
        validationRules: {
          equalTo: "password"
        },
        touched: false
      }
    }
  };

  constructor(props){
    super(props)
  };

  componentDidMount() {
    this.props.onAutoSignIn();
  }

	onSubmitAuthHandler = () => {
    const username = this.state.controls.username.value;
    const credentials = {
      email: this.state.controls.email.value,
      password: this.state.controls.password.value
    };
		this.props.onAuthSubmit(credentials, this.state.authMode, username)
	};

  switchAuthModeHandler = () => {
    this.setState(prevState => {
     return { authMode: prevState.authMode === 'login' ? 'signup' : 'login'} 
    })
  };

  updateInputState = (key, value) => {
    let connectedValue = {};
    if (this.state.controls[key].validationRules.equalTo) {
      const equalControl = this.state.controls[key].validationRules.equalTo;
      const equalValue = this.state.controls[equalControl].value;
      connectedValue = {
        ...connectedValue,
        equalTo: equalValue
      };
    }
    if (key === "password") {
      connectedValue = {
        ...connectedValue,
        equalTo: value
      };
    }

    this.setState(prevState => {
      return {
        controls: {
          ...prevState.controls,
          confirmPassword: {
            ...prevState.controls.confirmPassword,
            valid:
              key === "password"
                ? validate(
                    prevState.controls.confirmPassword.value,
                    prevState.controls.confirmPassword.validationRules,
                    connectedValue
                  )
                : prevState.controls.confirmPassword.valid
          },
          [key]: {
            ...prevState.controls[key],
            value: value,
            valid: validate(
              value,
              prevState.controls[key].validationRules,
              connectedValue
            ),
            touched: true
          }
        }
      };
    });
  };

  render() {

    let confirmPassword = null;
    let userName = null;

    if (this.state.authMode === "signup") {
      userName = (
        <DefaultInput
        style={styles.input}
        placeholder="Username"
        value={this.state.controls.username.value}
        onChangeText={val => this.updateInputState("username", val)}
        autoCapitalize="none"
        autoCorrect={false}
        maxLength={20}
        />
        )
      confirmPassword = (
        <DefaultInput
        style={styles.input}
        placeholder="Confirm Password"
        value={this.state.controls.confirmPassword.value}
        onChangeText={val => this.updateInputState("confirmPassword", val)}
        secureTextEntry
        />
        )
    }
    return (
      <ImageBackground 
      style={{width:'100%',height:'100%'}}
      source={require('../../../assets/background.jpg')}
      >
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <View style={{width:'100%',flex:1,alignItems:'center',justifyContent:'center'}}>
        <HeadingText 
          style={styles.headingText}
          color="white"
          title={this.state.authMode === "login" ? "Sign In" : "Sign Up"}
        />
        {userName}
        <DefaultInput
        style={styles.input}
        placeholder="Email"
        value={this.state.controls.email.value}
        onChangeText={val => this.updateInputState("email", val)}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        valid={this.state.controls.email.valid}
        touched={this.state.controls.email.touched}
        />
        <DefaultInput
        style={styles.input}
        placeholder="Password"
        value={this.state.controls.password.value}
        onChangeText={val => this.updateInputState("password", val)}
        valid={this.state.controls.password.valid}
        touched={this.state.controls.password.touched}
        secureTextEntry
        />
        {confirmPassword}
        <Button 
        title={this.state.authMode === "login" ? "Login" : "Sign Up"}
        color="white"
        radius={30}
        onPress={this.onSubmitAuthHandler}
        style={styles.submitButton}
        tnf={styles.tnf}
        disabled={
          (!this.state.controls.confirmPassword.valid &&
            this.state.authMode === "signup") ||
          !this.state.controls.email.valid ||
          !this.state.controls.password.valid
        }
        />
        <Button 
        title={this.state.authMode === "login" ? "Sign Up" : "Sign In"}
        color="white"
        onPress={this.switchAuthModeHandler}
        style={styles.toggleButton}
        textDecorationLine={('underline')}
        />
        </View>
      </KeyboardAvoidingView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
	container:{
		display: 'flex',
    width:'100%',
    height:'100%',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},
  headingText:{
    marginBottom: 0
  },
  submitButton: {
    width: '100%',
    padding: 15,
  },
  input: {
    margin: 15,
    width: '85%',
    backgroundColor: 'white',
    color: '#000',
    borderRadius: 30,
    paddingLeft: 20
  },
  tnf:{
    width:'85%',
    borderRadius:30,
    backgroundColor:'transparent',
    borderWidth:.75,
    borderColor:'#fff',
    margin:10
  }
});

const mapDispatchToProps = dispatch => {
  return {
    onAuthSubmit: (credentials, authMode, username) => dispatch(authSubmit(credentials, authMode, username)),
    onAutoSignIn: () => dispatch(authAutoSignIn())
  };
};


export default connect(null, mapDispatchToProps)(AuthScreen);