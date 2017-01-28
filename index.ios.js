// Only iOS code goes here!!!

// Import library to help create a Component
import React from 'react';
import { AppRegistry } from 'react-native';
import Header from './src/components/header';

// Create a component
const App = () => (
    <Header headerText={'Sweet Cow'} />
);

// Render to device
AppRegistry.registerComponent('sweetcow', () => App);
