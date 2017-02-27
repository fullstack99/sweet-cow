// Only iOS code goes here!!!
import React from 'react';
import { AppRegistry, View } from 'react-native';
import Header from './src/components/Header';
import LocationList from './src/components/LocationList';
import ShopLocationsMap from './src/components/ShopLocationMap';

const App = () => (

    <View style={styles.viewStyle}>
        <Header headerText={'SWEET COW'} />
        <ShopLocationsMap />
        <LocationList />
    </View>
);

const styles = {
    viewStyle: {
        backgroundColor: '#1B145C',
        flex: 1,
        alignSelf: 'stretch'
    }
};

AppRegistry.registerComponent('sweetcow', () => App);
