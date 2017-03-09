
import React, { Component } from 'react';
import { Image, Dimensions, Alert, PermissionsAndroid, ActivityIndicator, StyleSheet, TouchableOpacity, Linking, Platform, ScrollView } from 'react-native';
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
// import Pulse from 'react-native-pulse';
import Spinner from 'react-native-spinkit';

import Pulse from '../base/pulse'
import CustomPulse from './pulse'

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
const sweetCow_Marker = require('../../../images/SweetCow-marker.png');


const currentLocation_Marker = require('../../../images/map-marker1.png');
const marker_identifier = 'M'

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
      lastPosition: {coords:{
        latitude: 339.977755,
        longitude: -105.134582,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }
    },
    shops: [],
    shopsCoordinates: [],
    distanceArray: [],
    region: {
      latitude: 339.977755,
      longitude: -105.134582,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }
  };
}



watchID: ?number = null;

componentDidMount() {
  this.getCurrentLocationIfPermission()
}

fetchCurrentLocation(){

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
      this.setState({initialPosition})
      this.setState({region})

      var lastPosition = position;
      this.setState({lastPosition});
      this.getLocationList()
    },
    (error) => {
      this.getLocationList()
      alert(JSON.stringify(error))

    },
    { enableHighAccuracy: false, timeout: 20000 }
  );
  this.watchID = navigator.geolocation.watchPosition((position) => {
    var lastPosition = position;
    this.setState({lastPosition});

  });


}

async getCurrentLocationIfPermission(){
  this.setState({isLoading: true})

  if(Platform.OS !== 'android'){
    this.fetchCurrentLocation()
    return;
  }

  try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'Location Permission',
          'message': 'Sweet Cow needs access to your Location ' +
                     'so you can take navigate.'
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the Location")
        this.fetchCurrentLocation()


      } else {
        console.log("Location permission denied")
        // alert(JSON.stringify('Location Permission Denied'))
        this.fetchCurrentLocation()
        // this.getLocationList()
      }
    } catch (err) {
      console.warn(err)
      this.getLocationList()
      alert(JSON.stringify(err))
    }




}

focusMap(markers, animated) {
  console.log(`Markers received to populate map: ${markers}`);
  this.map.fitToSuppliedMarkers(markers, animated);
}

focus1() {
  this.focusMap([
    marker_identifier,
  ], true);
}


componentWillMount(){

  // setTimeout(
  //   () => {
  //     let element = {'identifier':marker_identifier ,'latitude': this.state.lastPosition.coords.latitude, 'longitude': this.state.lastPosition.coords.longitude, 'title': "Current Position", 'image': null, 'shop':null}
  //     let currentArray = this.state.shopsCoordinates
  //     currentArray.push(element)
  //     this.setState({shopsCoordinates: currentArray})
  //     this.returnShopCoordinates()
  //
  //   },
  //   time_out_get_Coordinates
  // );
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


openExternalMAps(location){
  var destination = location
  destination = destination.replace(/\s/g, "+");
  let url = 'comgooglemaps://?saddr='+this.state.lastPosition.coords.latitude+','+this.state.lastPosition.coords.longitude+'&daddr='+destination+'&directionsmode=drive'
  // if(Platform.OS !== 'android'){
  //   url = 'http://maps.apple.com/?saddr=sll='+this.state.lastPosition.coords.latitude+','+this.state.lastPosition.coords.longitude+'&daddr='+destination+'&dirflg=r'
  // }

  Linking.canOpenURL(url).then(supported => {
    if (!supported) {
      url = 'http://maps.apple.com/?saddr=sll='+this.state.lastPosition.coords.latitude+','+this.state.lastPosition.coords.longitude+'&daddr='+destination+'&dirflg=r'
      return Linking.openURL(url);
    } else {
      return Linking.openURL(url);
    }
  }).catch(err => console.error('An error occurred', err));
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

    console.log(responseJson)
    this.setState({isLoading: true, shops: responseJson})

    //Getting location corrdinates
    let element = {'identifier':marker_identifier ,'latitude': this.state.lastPosition.coords.latitude, 'longitude': this.state.lastPosition.coords.longitude, 'title': "Current Position", 'image': null, 'shop':null}
    let currentArray = this.state.shopsCoordinates
    currentArray.push(element)
    this.setState({shopsCoordinates: currentArray})
    this.returnShopCoordinates()

  })
  .catch((error) => {
    console.error(error);
  });
}

getDistanceBetweenPoints(){

  if(this.state.shopsCoordinates[0]!== undefined){
    var i = 0
    var urlDistance = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins='+this.state.shopsCoordinates[0].latitude+','+this.state.shopsCoordinates[0].longitude+'&destinations='

    this.state.shopsCoordinates.map((shopCoordinates)=>{
      if(i < this.state.shopsCoordinates.length - 1){
        urlDistance = urlDistance+this.state.shopsCoordinates[0].latitude+','+this.state.shopsCoordinates[0].longitude+'|'
      }else{
        urlDistance = urlDistance+this.state.shopsCoordinates[1].latitude+','+this.state.shopsCoordinates[1].longitude
      }
      i++
    })

    urlDistance = urlDistance+'&mode=driving&key=AIzaSyCUdBK1qZKBI6IDzTl9eT0HW-QEN-YgHqE'

    fetch(urlDistance)
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);

      var index = 0
      responseJson.rows[0].elements.map((element) => {

        if(element.status === 'OK'){
          let distance = element.distance.text
          let shopElement = {'coordinatesObj':this.state.shopsCoordinates[index], 'distance': distance}
          let currentArray = this.state.distanceArray
          currentArray.push(shopElement)
          this.setState({isLoading: false, distanceArray: currentArray})
          index++
        } else{

          let shopElement = {'coordinatesObj':this.state.shopsCoordinates[index], 'distance': null}
          let currentArray = this.state.distanceArray
          currentArray.push(shopElement)
          this.setState({isLoading: false, distanceArray: currentArray})
          index++
        }

      })
    })
    .catch((error) => {
      console.error(error);
    });

  }

}


returnShopCoordinates(){

  var i = 0
  let url = 'https://maps.googleapis.com/maps/api/geocode/json?address='
  this.state.shops.map((shop) => {
    let address =  shop.address + '+' + shop.location
    var fulladdress = address
    fulladdress = fulladdress.replace(/\s/g, "+");

    if(i < this.state.shopsCoordinates.length - 1){
      url = url+fulladdress+"|"
    }else{
      url = url+fulladdress
    }
    i++
  })
  url = url+'&key=AIzaSyCUdBK1qZKBI6IDzTl9eT0HW-QEN-YgHqE'


  this.setState({isLoading: true})

  fetch(url)
  .then((response) => response.json())
  .then((responseJson) => {

    console.log(responseJson);

    if(responseJson.results[0] !== undefined && responseJson.status !== 'ZERO_RESULTS'){
      var index = 0
      responseJson.results.map((result)=>{
        let currentArray = this.state.shopsCoordinates
        let element = {'identifier':marker_identifier, 'latitude': result.geometry.location.lat, 'longitude': result.geometry.location.lng, 'title': 'Sweet Cow', image:sweetCow_Marker, 'shop':this.state.shops[index]}
        currentArray.push(element)
        this.setState({shopsCoordinates: currentArray})
        index++
      })
      this.focus1();
      this.getDistanceBetweenPoints()

    }
  })

  .catch((error) => {
    console.error(error);
  });
}

centerMapaAtMyLocation(){
  this.focus1()
}

_onRegionChange = (region) => {
  this.setState({
    region: region,
  });
};



getAnimatedMarkers(marker){


  // <Spinner pointerEvents="none" isVisible={true}  size= {100}  color='#5c85c0' type='Bounce' style={{ marginTop: -50}}>
  //
  // </Spinner>

  // <Pulse color='rgba(92,133,192,1)' numPulses={1} diameter={100} top={-50} speed={20} duration={1000}>
  //
  // </Pulse>
  //
  // <View style={{height:20 , width: 20, backgroundColor:'rgba(92,133,192,1)', borderRadius:10, position: "absolute", marginLeft:40, marginTop:-10 }}>
  // </View>

  return(

    <Map.Marker
    coordinate={{latitude: marker.latitude,longitude: marker.longitude,}}
    identifier={marker.identifier}
    title={marker.title}
    image={currentLocation_Marker}
     pointerEvents="none"
    >

    </Map.Marker>
  )
}

getMarkers(marker){


  return(

    <Map.Marker
    coordinate={{latitude: marker.latitude,longitude: marker.longitude,}}
    identifier={marker.identifier}
    title={marker.title}
    image={marker.image}
    />
  )
}

render() {
  let borderwidth = 6
  let deviceHeightDiff = deviceHeight/568.0
  if(deviceHeightDiff > 1){
    deviceHeightDiff += 0.25
  }

  var locList = []
  this.state.distanceArray.map((shop) => {
    if(shop.coordinatesObj.shop !== null)
    locList.push(<ShopLocationCell shop={shop} onPress={(location)=>this.openExternalMAps(location)}/>)
  })

  var markers = []
  this.state.shopsCoordinates.map(marker => {
    if(marker.image !== null){
      markers.push(this.getMarkers(marker))
    }else{
      markers.push(this.getAnimatedMarkers(marker))
    }

  })


  return (
    <Container style={{marginLeft:3}}>

    <View style={{ }}>
    <View style={{width: deviceWidth, height: deviceHeight * 0.16, flexDirection:'row'}}>
    <Image source={logoCow} style={{marginLeft: 10, width: deviceWidth/2.2, height: deviceHeight/6.2, alignSelf:'flex-start', marginTop: 0, resizeMode: 'contain'}}/>

    <TouchableOpacity onPress={()=>this.centerMapaAtMyLocation()}>
    <View>
    <Image source={map_icon} style={{marginLeft: 25, marginTop: 25, width: deviceWidth/12, height: deviceHeight/12, resizeMode: 'contain'}}/>
    </View>
    </TouchableOpacity>

    <TouchableOpacity onPress={()=>this.test()}>
    <View>
    <Image source={search_icon} style={{marginLeft: 8, marginTop: 25, width: deviceWidth/12, height: deviceHeight/12, resizeMode: 'contain'}}/>
    </View>
    </TouchableOpacity>

    <TouchableOpacity>
    <View>
    <Image source={favorite_icon} style={{marginLeft: 8, marginTop: 25, width: deviceWidth/12, height: deviceHeight/12, resizeMode: 'contain'}}/>
    </View>
    </TouchableOpacity>

    <TouchableOpacity onPress={()=>this.logoutButtonPressed()}>
    <View>
    <Image source={user_icon} style={{marginLeft: 8, marginTop: 25, width: deviceWidth/12, height: deviceHeight/12, resizeMode: 'contain'}}/>
    </View>
    </TouchableOpacity>
    </View>

    <View style={{width: deviceWidth, height: borderwidth,  backgroundColor:'rgba(37, 0, 97, 1)' }}>
    </View>
    <View style={{width: deviceWidth, height: deviceHeight*0.4}}>
    <Text style={{alignSelf:'center', marginTop: 50}}> Map view here </Text>
    <Map
    provider={this.props.provider}
    ref={ref => { this.map = ref; }}
    region={this.state.region}
    style={ styles.map }
    onRegionChange={this._onRegionChange}
    >
    {markers}
    </Map>
    </View>
    </View>

    <View style={{marginTop:-borderwidth, borderWidth:borderwidth, borderColor:'rgba(37, 0, 97, 1)', width: deviceWidth, height: ((deviceHeight * 0.44))}}>

    <View>

    <Text style={{alignSelf:'center', marginTop: 10, fontSize: 25, color: 'rgba(37, 0, 97, 1)', fontFamily:"Trade Gothic LT Std"}}> SHOPS AROUND ME </Text>
    </View>

    <View>

    </View>

    <ScrollView
    automaticallyAdjustContentInsets={false}
    vertical={true}
    >
    {locList}
    </ScrollView>
    </View>
    <Loading isLoading={this.state.isLoading}/>

    </Container>

  );
}
}

MapView.propTypes = {
  provider: MapView.ProviderPropType,
};

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
