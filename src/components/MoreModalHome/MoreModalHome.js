import React from 'react';
import { 
    Text, 
    StyleSheet, 
    View, 
    Modal, 
    TouchableWithoutFeedback, 
    TouchableOpacity 
} from 'react-native';

const MoreModalHome = (props) => {
        return (
            <Modal
        animationType="fade"
        visible={props.visible}
        transparent={true}
        onRequestClose={() => console.log("Modal closed")}
      >
        <TouchableWithoutFeedback
          onPress={props.closeModal}
        >
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modal}>
          <View style={{ alignItems: 'flex-start' }}>
            <TouchableOpacity
              onPress={props.modalVisible}>
              <Text style={styles.modalText}>Copy link</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={props.stopFollowing}>
              <Text style={styles.modalText}>Stop following</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={props.modalVisible}>
              <Text style={styles.modalText}>Report...</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={props.modalVisible}>
              <Text style={styles.modalText}>Share post</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={props.modalVisible}>
              <Text style={styles.modalText}>Silence</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
        );
    }

const styles = StyleSheet.flatten({
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
      modalText: {
        padding: 10,
        fontSize: 16
      },
      modalOverlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)'
      }
});

export default MoreModalHome;