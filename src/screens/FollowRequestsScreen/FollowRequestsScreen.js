import React, { Component } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { acceptInvitation, rejectRequest } from '../../store/actions';
import UserHeading from '../../components/UserHeading/UserHeading';
import Button from '../../components/UI/Button';

class FollowRequestsScreen extends Component {
  constructor(props){
    super(props) 
   
  }

  confirmRequest = (user, e) => {
    this.props.onConfirmRequest(user, this.props.sessionUser);
  }

  removeRequest = (user, e) => {
    this.props.onRejectRequest(user, this.props.sessionUser);
  }

  render() {

    const requests = this.props.requests;

    return (
      <View style={styles.container}>
      {requests.length >= 1 ? 
        <FlatList
          data={requests}
          renderItem={({ item }) => (
            <View style={{flexDirection:'row',alignItems:'center'}}>
            <View style={{flex:2}}>
              <UserHeading
                user={item}
              />
            </View>
            
            <Button 
            onPress={this.confirmRequest.bind(this, item)}
            style={styles.btnConfirm}
            title="Confirm"
            color="#fff"
            />
            <Button 
            onPress={this.removeRequest.bind(this, item)}
            style={styles.btnRemove}
            title="Remove"
            color="#DA2E6B"
            />
           
            </View>
          )}
          keyExtractor={item => item.key}
        />
        : null }
      </View>
    );
  }
}

const styles = StyleSheet.flatten({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: '#fff',
    padding: 10
  },
  btnConfirm:{
    flexShrink:1,
    backgroundColor:'#DA2E6B',
    borderColor:'#DA2E6B',
    borderWidth:1,
    paddingTop:3,
    paddingBottom:3,
    paddingLeft:7,
    paddingRight:7,
    borderRadius:7
  },
  btnRemove:{
    flexShrink:1,
    backgroundColor:'#fff',
    borderColor:'#DA2E6B',
    borderWidth:1,
    paddingTop:3,
    paddingBottom:3,
    paddingLeft:7,
    paddingRight:7,
    borderRadius:7,
    marginLeft:7
  }
});


const mapStateToProps = state => {
  return {
    sessionUser: state.users.user,
    requests: state.users.requests
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onConfirmRequest: (userRequest, sessionUser) => dispatch(acceptInvitation(userRequest, sessionUser)),
    onRejectRequest: (userRequest, sessionUser) => dispatch(rejectRequest(userRequest, sessionUser))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FollowRequestsScreen);