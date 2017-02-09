import React, { Component } from 'react';
import { Text, ScrollView } from 'react-native';
import axios from 'axios';
import LocationDetail from './LocationDetail';

class LocationList extends Component {
    state = { albums: [] };

    componentWillMount() {
        console.log('componentWillMount is working!');
        axios.get('https://rallycoding.herokuapp.com/api/music_albums')
            .then(response => this.setState({ albums: response.data }));
        console.log('Asynchronous GET promise in progress...');
    }

    renderAlbums() {
        return this.state.albums.map(album =>
            <LocationDetail key={album.title} album={album} />
        );
    }

    render() {
        console.log(this.state);

        return (
            <ScrollView style={styles.viewStyle}>
                <Text style={styles.headingStyle}>STORE LOCATIONS</Text>
                {this.renderAlbums()}
            </ScrollView>
        );
    }
}

const styles = {
    viewStyle: {
        backgroundColor: '#fff',
        borderRadius: 2,
        marginTop: 20,
        marginHorizontal: 5
    },
    headingStyle: {
        textAlign: 'center',
        paddingVertical: 10,
        paddingBottom: 5,
        color: '#1d1060',
        fontSize: 24,
        fontWeight: '700'
    }
};

export default LocationList;
