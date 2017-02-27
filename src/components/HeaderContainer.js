import React from 'react';
import { View } from 'react-native';

const HeaderContainer = (props) => {
    const { headerContainerStyle } = styles;

    return (
        <View style={headerContainerStyle}>
            {props.children}
        </View>
    );
};

const styles = {
        headerContainerStyle: {
        borderRadius: 2,
        backgroundColor: '#F8F8F8',
        flexDirection: 'row',
        alignItems: 'flex-start',
        height: 100,
        padding: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        elevation: 2,
        position: 'relative',
        marginTop: 0
    }
}

export default HeaderContainer;
