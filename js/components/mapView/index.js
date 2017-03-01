
import React, { Component } from 'react';
import { Image, Dimensions, Alert, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container, Content, Button, View, Text, ListItem } from 'native-base';
import TextField from '../base/textField/'
import CustomButton from '../base/button/'

import { setUser } from '../../actions/user';
import * as firebase from "firebase";
import FirDatabase from "../../database/";
import Map from 'react-native-maps';
import ShopLocationCell from "./shopLocationCell";
import Loading from '../base/loading/'


const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const {
  replaceAt,
} = actions;

const background = require('../../../images/background_login.png');
const logoCow = require('../../../images/logo_cow_horizontal.png');
const map_icon = require('../../../images/map-locator.png');
const search_icon = require('../../../images/search-icon.png');
const favorite_icon = require('../../../images/favorite-icon.png');
const user_icon = require('../../../images/user-icon.png');

const currentLocation_Marker = require('../../../images/map-marker1.png');

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

class MapView extends Component {

  static propTypes = {
    setUser: React.PropTypes.func,
    replaceAt: React.PropTypes.func,
    navigation: React.PropTypes.shape({
      key: React.PropTypes.string,
    }),
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    initialPosition: undefined,
    lastPosition: 'unknown',
    shops: [],
    region: {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }
    };
  }



watchID: ?number = null;

componentDidMount() {
  navigator.geolocation.getCurrentPosition(
    (position) => {

      var initialPosition = position;
      // this.setState({initialPosition});
      let region = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }
      this.setState({region})
      console.warn(initialPosition)
    },
    (error) => alert(JSON.stringify(error)),
    {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
  );
  this.watchID = navigator.geolocation.watchPosition((position) => {
    var lastPosition = JSON.stringify(position);
    this.setState({lastPosition});
  });
}

componentWillMount(){
  this.getLocationList()

}

componentWillUnmount() {
  navigator.geolocation.clearWatch(this.watchID);
}


  replaceRoute(route) {
    this.props.replaceAt('mapView', { key: route }, this.props.navigation.key);
  }

  logoutButtonPressed(){
    this.setState({isLoading: true})
      this.logout()
  }

  async logout() {

      try {

          await firebase.auth().signOut();
          this.setState({isLoading: false})
          this.replaceRoute("home")

      } catch (error) {
          console.log(error);
      }

  }


  getLocationList(){
    this.setState({isLoading: true})
    fetch('https://sweet-cow-store-locations.herokuapp.com/api/locations')
      .then((response) => response.json())
      .then((responseJson) => {
        console.warn(responseJson)
        console.log(responseJson)
        this.setState({isLoading: false, shops: responseJson})
// this.setState({isLoading: false, shops: response._bodyInit})
      })
      .catch((error) => {
        console.error(error);
      });
  }

  onRegionChange(region) {
    console.warn(region)
    // this.setState({ region });
  }


  render() {
    let borderwidth = 6
    let deviceHeightDiff = deviceHeight/568.0
    if(deviceHeightDiff > 1){
      deviceHeightDiff += 0.25
    }

    var locList = []


    this.state.shops.map((shop) => {
      locList.push(<ShopLocationCell shop={shop}/>)
    })



    return (
      <Container style={{marginLeft:3, borderWidth:borderwidth, borderColor:'rgba(37, 0, 97, 1)', width: deviceWidth}}>

      <View style={{ }}>
      <View style={{marginLeft:-borderwidth, marginTop:-borderwidth, borderWidth:borderwidth, borderColor:'rgba(37, 0, 97, 1)', width: deviceWidth, height: deviceHeight/6, flexDirection:'row'}}>
      <Image source={logoCow} style={{marginLeft: 10, width: deviceWidth/2.2, height: deviceHeight/6.2, alignSelf:'flex-start', marginTop: 0, resizeMode: 'contain'}}/>

      <TouchableOpacity>
      <View>
      <Image source={map_icon} style={{marginLeft: 20, marginTop: 25, width: deviceWidth/12, height: deviceHeight/12, resizeMode: 'contain'}}/>
      </View>
      </TouchableOpacity>

      <TouchableOpacity>
      <View>
      <Image source={search_icon} style={{marginLeft: 5, marginTop: 25, width: deviceWidth/12, height: deviceHeight/12, resizeMode: 'contain'}}/>
      </View>
      </TouchableOpacity>

      <TouchableOpacity>
      <View>
      <Image source={favorite_icon} style={{marginLeft: 5, marginTop: 25, width: deviceWidth/12, height: deviceHeight/12, resizeMode: 'contain'}}/>
      </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={()=>this.logoutButtonPressed()}>
      <View>
      <Image source={user_icon} style={{marginLeft: 5, marginTop: 25, width: deviceWidth/12, height: deviceHeight/12, resizeMode: 'contain'}}/>
      </View>
      </TouchableOpacity>
      </View>

      <View style={{marginLeft:-borderwidth, marginTop:-borderwidth, borderWidth:borderwidth, borderColor:'rgba(37, 0, 97, 1)', width: deviceWidth, height: deviceHeight/2.4}}>
      <Text style={{alignSelf:'center', marginTop: 50}}> Map view here </Text>
      <Map
          style={ styles.map }
          region={this.state.region}
          onRegionChange={this.onRegionChange}
        >
        <Map.Marker.Animated
      coordinate={{latitude: this.state.region.latitude, longitude: this.state.region.longitude}}
      title="CurrentLocation"
      image={currentLocation_Marker}
    />
    </Map>
      </View>

      </View>
      <View>
      <Text style={{alignSelf:'center', marginTop: 10, fontSize: 25, color: 'rgba(37, 0, 97, 1)', fontFamily:"Trade Gothic LT Std"}}> SHOPS AROUND ME </Text>
      </View>

      <View>

      </View>

      <Content bounces={false} style={{flex: 1, flexDirection: 'column', marginLeft: 0}}>
      {locList}
      </Content>
        <Loading isLoading={this.state.isLoading}/>

      </Container>




    );
  }
}

function bindActions(dispatch) {
  return {
    replaceAt: (routeKey, route, key) => dispatch(replaceAt(routeKey, route, key)),
    setUser: name => dispatch(setUser(name)),
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
});

export default connect(mapStateToProps, bindActions)(MapView);
