import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    FlatList,
    Modal,
    TouchableWithoutFeedback,
    TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import UserHeading from '../../components/UserHeading/UserHeading';
import TextInputWithIcon from '../../components/UI/TextInputWithIcon';
import { getChat, deleteChat } from '../../store/actions';

class ContactListScreen extends Component {
    constructor(props) {
        super(props)

        this.state = {
            searchField: "",
            modalVisible: false
        }
    }

    //Change state when insert text on searchfield.
    onSearchInputChange = (value) => {
        this.setState({ searchField: value })
    }

    //Open contact chat 
    openChatHandler = (item) => {
        this.props.getChat(this.props.sessionUser, item);
        this.props.navigator.showModal({
            screen: 'insta-like.ContactChatScreen',
            title: `${item.username} Private Chat`,
            animationType: 'slide-up',
            passProps: {
                author: item
            },
            navigatorButtons: {
                rightButtons: [
                    {
                        title: 'Close',
                        id: "close"
                    }
                ]
            },
            navigatorStyle: {
                navBarButtonColor: '#fff'
            }
        });
    }

    //Open conversation modal.
    openModal = (item) => {
        this.setState({
            modalVisible: true,
            recipient: item.key
        })
    }
    //Close modal handler.
    onCloseModalHandler = () => {
        this.setState({
            modalVisible: false,
            recipient: null
        });
    }
    //Delete conversation.
    onDeleteChatHandler = () => {
        this.props.onDeleteChat(this.props.sessionUser, this.state.recipient);
        this.setState({
            modalVisible: false,
            recipient: null
        });
    }

    render() {

        const chats = this.props.sessionUser.chats;
        const newMessages = this.props.newMessages;
        //Search field filter.
        contacts = this.props.follow.filter(contact => {
            return contact.username.toLowerCase().includes(this.state.searchField.toLowerCase());
        })

        const modal = (
            <Modal
                animationType="fade"
                visible={this.state.modalVisible}
                transparent={true}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                }}>
                <TouchableWithoutFeedback
                    onPress={this.onCloseModalHandler}
                >
                    <View style={styles.modalOverlay} />
                </TouchableWithoutFeedback>
                <View style={styles.modal}>
                    <TouchableOpacity
                        onPress={this.onCloseModalHandler}>
                        <View style={{ alignItems: 'flex-start', borderBottomColor: '#ccc', borderBottomWidth: 1 }}>
                            <Text style={styles.modalText}>Close</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this.onDeleteChatHandler}>
                        <View style={{ alignItems: 'flex-start' }}>
                            <Text style={styles.modalText}>Delete chat</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </Modal>
        )


        return (
            <View style={{ height: '100%', width: '100%', backgroundColor: '#fff' }}>
                {modal}
                <View style={styles.container}>
                    <FlatList
                        style={{ borderBottomColor: '#ddd', borderBottomWidth: 1, padding: 10 }}
                        extraData={{chats,newMessages}}
                        data={contacts}
                        renderItem={({ item }) => (
                            chats.filter(chat => chat == item.key).length >= 1 &&
                            <UserHeading
                                message={newMessages.filter(newMsg => newMsg === item.key).length >= 1 ? true : false}
                                user={item}
                                onOpenComments={this.openChatHandler.bind(this, item)}
                                onLongPress={this.openModal.bind(this, item)}
                            />
                        )}
                        keyExtractor={item => item.key}
                    />
                    <View
                        style={{ padding: 10 }}
                    >
                        <TextInputWithIcon
                            style={styles.searchInput}
                            placeholder="Search"
                            onChangeText={(value) => this.onSearchInputChange(value)}
                        />
                    </View>
                    <FlatList
                        style={{ padding: 10, paddingTop: 0 }}
                        extraData={chats}
                        data={contacts}
                        renderItem={({ item }) => (
                            chats.filter(chat => chat === item.key).length < 1 &&
                                <UserHeading
                                    user={item}
                                    onOpenComments={this.openChatHandler.bind(this, item)}
                                />
                    )}
                        keyExtractor={item => item.key}
                    />
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.flatten({
    container: {
        width: '100%',
        height: 'auto'
    },
    searchInput: {
        borderRadius: 30,
        borderColor: '#ddd',
        borderWidth: 1
    },
    modal: {
        width: '90%',
        position: 'absolute',
        top: '25%',
        left: '5%',
        zIndex: 999,
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderRadius: 10,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { with: 5, height: 5 },
        shadowOpacity: .7,
        paddingTop: 5,
        paddingBottom: 5
    },
    modalOverlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalText: {
        padding: 10,
        fontSize: 16
    }
});

const mapStateToProps = state => {
    return {
        sessionUser: state.users.user,
        follow: state.users.follow,
        chats: state.users.chat,
        newMessages: state.users.notReadMessages
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getChat: (sessionUser, recipient) => dispatch(getChat(sessionUser, recipient)),
        onDeleteChat: (sessionUser, recipientKey) => dispatch(deleteChat(sessionUser, recipientKey)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactListScreen);