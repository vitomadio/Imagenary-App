import React from 'react';
import {
    View, 
    StyleSheet
} from 'react-native';

const Triangle = (props) => (
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
        zIndex:999
    },
    triangle:{
        width:18,
        height:18,
        transform:[{rotate:'45deg'}],
        bottom:10,
        left:3
    }
})

export default Triangle;

