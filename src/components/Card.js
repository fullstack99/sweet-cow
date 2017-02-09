import React from 'react';
import { View } from 'react-native';

const Card = (props) => {
    return (
        <View style={styles.containerStyle}>
            {props.children}
        </View>
    );
};

const styles = {
    containerStyle: {
        borderRadius: 2,
        borderColor: '#3f3816',
        borderStyle: 'solid',
        borderWidth: 3,
        marginHorizontal: 8,
        marginTop: 10,
        marginBottom: 20
    }
};

export default Card;
