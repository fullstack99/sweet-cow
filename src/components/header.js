// import libraries for making a Component
import React from 'react';
import { Text, View, Image } from 'react-native';
import HeaderContainer from './HeaderContainer';

// make a Component
const Header = (props) => {
    const { textStyle, textContainerStyle, thumbnailStyle, thumbnailContainerStyle } = styles;

    return (
        <HeaderContainer>
            <View style={thumbnailContainerStyle}>
                <Image style={thumbnailStyle} source={require('../img/logo@2x.png')} />
            </View>

            <View style={textContainerStyle}>
                <Text style={textStyle}>{props.headerText}</Text>
            </View>
        </HeaderContainer>
    );
};

const styles = {
    textStyle: {
        fontSize: 20,
        fontWeight: '700',
        paddingTop: 20
    },
    textContainerStyle: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    thumbnailStyle: {
        height: 58,
        width: 59,
    },
    thumbnailContainerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
        paddingTop: 5
    }
};

// make Component available to other parts of the app
export default Header;
