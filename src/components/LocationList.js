import React, { Component } from 'react';
import { View } from 'react-native';
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
            <View>
                {this.renderAlbums()}
            </View>
        );
    }
}

export default LocationList;
