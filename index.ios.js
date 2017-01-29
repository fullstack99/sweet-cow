// Only iOS code goes here!!!

// Import library to help create a Component
import React from 'react';
import { AppRegistry, View } from 'react-native';
import Header from './src/components/Header';
import LocationList from './src/components/LocationList';

// Create a component
const App = () => (
    <View>
        <Header headerText={'Sweet Cow'} />
        <LocationList />
    </View>
);

// Render to device
AppRegistry.registerComponent('sweetcow', () => App);
