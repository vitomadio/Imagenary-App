import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  FlatList,
  Modal,
  TextInput
} from 'react-native';
import { connect } from 'react-redux';
import Avatar from '../UI/Avatar';
import TextInputWithIcon from '../UI/TextInputWithIcon';
import Button from '../UI/Button';

class ContactsList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      searchfield: ""
    }
  }

  searchUserHandler = (value) => {
    this.setState({ searchfield: value })
  }

  render() {
    const follow = this.props.follow;
    const followers = this.props.followsMe;
    const mergedArray = [...follow, ...followers]
    let contacts = [];
    mergedArray.map((item, i) => {
      if (contacts.filter(contact => contact.key === item.key).length == 0) {
        contacts.push(item)
      }
    });

    const contactsList = contacts.filter(contact => {
      return contact.username.toLowerCase().includes(this.state.searchfield.toLowerCase())
    })

    return (
      <Modal
        animationType="slide"
        visible={this.props.modalVisible}
        transparent={true}
        onRequestClose={() => console.log("Modal closed")}
      >
        <TouchableWithoutFeedback
          onPress={this.props.closeModal}
        >
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View
          style={styles.modalContainer}
        >
          <View style={styles.searchInput}>
            <TextInputWithIcon
              style={{ backgroundColor: 'transparent' }}
              placeholder="Search"
              onChangeText={this.searchUserHandler}
            />
          </View>
          <View style={styles.input}>
            <TextInput
              style={{ backgroundColor: 'transparent' }}
              placeholder="Write a message"
              onChangeText={this.props.onChangeText}
            />
          </View>
          <FlatList
            style={{ borderTopColor: '#ccc', borderTopWidth: 1, marginTop: 3 }}
            data={contactsList}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <View style={{ flex: 4, flexDirection: 'row', alignItems: 'center' }}>
                  <Avatar
                    source={{ uri: item.avatar }}
                    style={{ height: 50, width: 50, borderRadius: 25, marginLeft: 5 }}
                  />
                  <Text style={styles.text}>{item.username}</Text>
                </View>
                <Button
                  style={styles.button}
                  title="Send"
                  color="#fff"
                  onPress={this.props.openChat(item)}
                />
              </View>
            )}
            keyExtractor={(item) => item.key}
          />
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: '#fff',
    width: '100%',
    height: '75%',
    marginTop: '45%',
    paddingTop: 5,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.7,
    elevation: 4
  },
  item: {
    borderBottomColor: '#bbb',
    borderBottomWidth: 1,
    padding: 7,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginLeft: 10
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    margin: 10,
    borderRadius: 30,
  },
  input:{
    margin: 10,
    marginTop:0,
    borderBottomWidth:1,
    borderBottomColor:'#ccc'
  },
  modalOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  button: {
    backgroundColor: 'purple',
    borderRadius: 30,
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    paddingTop: 5,
    paddingBottom: 5
  }

})

mapStateToProps = state => {
  return {
    sessionUser: state.users.user,
    follow: state.users.follow,
    followsMe: state.users.followsMe
  }
}

export default connect(mapStateToProps, null)(ContactsList);