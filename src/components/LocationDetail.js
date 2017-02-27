import React from 'react';
import { Text, View } from 'react-native';
import Card from './Card';
import CardSection from './CardSection';


const LocationDetail = ({ shop }) => {
    const { location, city, state, zip_code, phone, address } = shop;
    const {
        headerContentStyle,
        headerTextStyle
    } = styles;

    return (
        <Card>
            <CardSection>
                <View style={headerContentStyle}>
                    <Text style={headerTextStyle}>{location.toUpperCase()}</Text>
                    <Text>{address}</Text>
                </View>
            </CardSection>
        </Card>
    );
};

const styles = {
    headerContentStyle: {
        flexDirection: 'column',
        justifyContent: 'space-around'
    },
    headerTextStyle: {
        fontSize: 18,
        fontWeight: '700'
    }
};
export default LocationDetail;
