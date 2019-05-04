import { 
  AUTH_SET_TOKEN, 
  AUTH_REMOVE_TOKEN 
    } from './actionsTypes';
import { Navigation } from 'react-native-navigation';
import { AsyncStorage } from 'react-native';
import { getSessionUser, getUsers, getPosts, getContacts } from '../actions';
import firebase from 'react-native-firebase'

import startMainTabs from '../../screens/MainTabs/StartMainTabs';

const API_KEY = "AIzaSyBEIj9ZPgprR5KwN3mg5xHtjbb9Jlf1x4Q";

const db = firebase.database();

//User authentication...
export const authSubmit = (credentials, authMode, username) => {
	return dispatch => {
		let	url = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=" + API_KEY;
		if (authMode === 'signup') {
      url = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=" + API_KEY;
    }
    fetch(url, {
     method: "POST",
     body: JSON.stringify({
      email: credentials.email,
      password: credentials.password,
      returnSecureToken: true
    }),
     headers: {
      "Content-Type" : "application/json"
    }
  })
  .catch(err => {
     alert("Authentication failed, please try again.")
     console.log(err);
   })
    .then(res => res.json())
    .then(parsedRes => {
      if(authMode === 'signup'){
        db.ref('/users/'+parsedRes.localId).set({
          email: credentials.email,
          avatar: "https://gladstoneentertainment.com/wp-content/uploads/2018/05/avatar-placeholder.gif",
          username: username
        }, (err) => {
          if(err){
            console.log(err);
          } else {
            console.log('passed')
          }
        })
      };
      if (!parsedRes.idToken) {
        alert("Something went wrong please try again!");
      } else {
        dispatch(
         authStoreToken(
          parsedRes.idToken,
          parsedRes.expiresIn,
          parsedRes.refreshToken,
          parsedRes.localId
          )
         );
        dispatch(getSessionUser(parsedRes.localId));
        dispatch(getMessagingToken(parsedRes.localId));
        dispatch(getUsers());
        dispatch(getPosts(parsedRes.localId));
        dispatch(getContacts(parsedRes.localId));
        startMainTabs();
      };
    }); 
  };
};

//Get messaging token and save it into database...
export const getMessagingToken = (userId) => {
  return dispatch => {
      firebase.messaging().getToken()
      .then(fcmToken => {
        if(fcmToken){
          db.ref('/users/'+userId+'/notificationsToken/'+fcmToken).set(fcmToken);
        }else{
          console.log("There's no token");
        }
      })
      .catch(err => console.log(err));
  };
};


//Store token into AsyncStorage (localStorage equivalent)...
export const authStoreToken = (token, expiresIn, refreshToken, localId) => {
  return dispatch => {
    const now = new Date();
    const expiryDate = now.getTime() + expiresIn * 1000;
    dispatch(authSetToken(token, expiryDate, localId));
    AsyncStorage.setItem("ap:auth:token", token);
    AsyncStorage.setItem("ap:auth:expiryDate", expiryDate.toString());
    AsyncStorage.setItem("ap:auth:refreshToken", refreshToken);
    AsyncStorage.setItem("ap:auth:userId", localId);
  };
};

//Store token in redux store...
export const authSetToken = (token, expiryDate, localId) => {
  return {
    type: AUTH_SET_TOKEN,
    token: token,
    expiryDate: expiryDate,
    userId: localId
  };
};

//Auto get token if session has no expired...
export const authGetToken = () => {
  return (dispatch, getState) => {
    const promise = new Promise((resolve, reject) => {
      const token = getState().auth.token;
      const userId = getState().auth.userId;
      const expiryDate = getState().auth.expiryDate;
      if (!token || new Date(expiryDate) <= new Date()) {
        let fetchedToken;
        AsyncStorage.getItem("ap:auth:token")
        .catch(err => reject())
        .then(tokenFromStorage => {
          fetchedToken = tokenFromStorage;
          if (!tokenFromStorage) {
            reject();
            return;
          }
          return {
            expiryDate: AsyncStorage.getItem("ap:auth:expiryDate"),
            userId: AsyncStorage.getItem("ap:auth:userId")
          }
        })
        .then(data => {
          const parsedExpiryDate = new Date(parseInt(data.expiryDate));
          const now = new Date();
          if (parsedExpiryDate > now) {
            dispatch(authSetToken(fetchedToken, parsedExpiryDate, data.userId));
            dispatch(getSessionUser(data.userId));
            dispatch(getMessagingToken(data.userId));
            dispatch(getPosts(data.userId));
            dispatch(getContacts(data.userId));
            dispatch(getUsers());
            resolve(fetchedToken);
          } else {
            reject();
          }
        })
        .catch(err => reject());
      } else {
        resolve(token);
      }
    });
    return promise
    .catch(err => {
      return AsyncStorage.getItem("ap:auth:refreshToken")
      .then(refreshToken => {
        return fetch(
          "https://securetoken.googleapis.com/v1/token?key=" + API_KEY,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: "grant_type=refresh_token&refresh_token=" + refreshToken
          }
          );
      })
      .then(res => res.json())
      .then(parsedRes => {
        if (parsedRes.id_token) {
          dispatch(
            authStoreToken(
              parsedRes.id_token,
              parsedRes.expires_in,
              parsedRes.refresh_token,
              parsedRes.user_id
              )
            );
          dispatch(getSessionUser(parsedRes.user_id));
          dispatch(getMessagingToken(parsedRes.user_id));
          dispatch(getPosts(parsedRes.user_id))
          dispatch(getContacts(parsedRes.user_id))
          dispatch(getUsers());
          return parsedRes.id_token;
        } else {
          dispatch(authClearStorage());
        }
      });
    })
    .then(token => {
      if (!token) {
        throw new Error();
      } else {
        return token;
      }
    });
  };
};

//Auto signin function if session token has no expired...
export const authAutoSignIn = () => {
  return dispatch => {
    dispatch(authGetToken())
    .then(token => {
      startMainTabs();
    })
    .catch(err => console.log("Failed to fetch token! ", err));
  };
};

//Clear AsyncStorage when logout...
export const authClearStorage = () => {
  return dispatch => {
    AsyncStorage.removeItem("ap:auth:token");
    AsyncStorage.removeItem("ap:auth:expiryDate");
    return AsyncStorage.removeItem("ap:auth:refreshToken");
  };
};

//Logout function...
export const authLogout = () => {
  return dispatch => {
    dispatch(authClearStorage())
    .then(() => {
      Navigation.startSingleScreenApp({
        screen: {
          screen: 'insta-like.AuthScreen',
          title: 'Login',
          navigatorStyle: {
            navBarHidden: true
          }
        }
      });
    });
    dispatch(authRemoveToken());
  };
};

//Remove token after logout...
export const authRemoveToken = () => {
  return {
    type: AUTH_REMOVE_TOKEN
  };
};

