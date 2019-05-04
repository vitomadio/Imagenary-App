import React from 'react';
import {
    View, 
    StyleSheet
} from 'react-native';

const TriangleShadow = (props) => (
    <View style={[styles.container, {top:props.top,right:props.right,left:props.left}]}>
        <View style={[styles.triangle, {backgroundColor:props.color}]}>

        </View>
    </View>
)

const styles = StyleSheet.create({
    container: {
        width:34,
        height:16,
        overflow:'hidden',
        position:'absolute',
        zIndex:3
    },
    triangle:{
        width:18,
        height:18,
        transform:[{rotate:'45deg'}],
        shadowColor: '#000',
		shadowOffset: { width: 1, height: 2 },
		shadowRadius: 5,
		shadowOpacity: 0.9,
        elevation: 3,
        bottom:10,
        left:3
    }
})

export default TriangleShadow;

