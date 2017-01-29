import React from 'react';
import { View, Text } from 'react-native';


const LocationDetail = (props) => {
    return (
        <View>
            <Text>{props.album.title}</Text>
        </View>
    );
};

export default LocationDetail;
