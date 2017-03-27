
import React, { Component } from 'react';
import { Image, Dimensions, Alert, PermissionsAndroid, ActivityIndicator, StyleSheet, TouchableOpacity, Linking, Platform, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container, Content, Button, View, Text, ListItem } from 'native-base';
import TextField from '../base/textField/'
import CustomButton from '../base/button/'
import * as firebase from "firebase";
import FirDatabase from "../../database/";
import Map from 'react-native-maps';
import ShopLocationCell from "./shopLocationCell";
import Loading from '../base/loading/'
import { openExternalMaps } from '../../utils/';
import SearchResults from "../SearchScreen/SearchResults"
import { setUser } from '../../actions/user';
import { setShopData } from '../../actions/shopData';
import { setLastPosition } from '../../actions/lastPosition';



import CustomPulse from './pulse'

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const {
  replaceAt,
  popRoute,
  pushRoute,
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
    popRoute: React.PropTypes.func,
    pushRoute: React.PropTypes.func,
    navigation: React.PropTypes.shape({
      key: React.PropTypes.string,
    }),
  }

  popRoute() {
    this.props.popRoute(this.props.navigation.key);
  }

  pushRoute(route){
    this.props.setLastPosition(this.state.lastPosition);
    this.props.setShopData(this.state.distanceArray);
    this.props.pushRoute({ key: route}, this.props.navigation.key);
  }

  openShopDetails(shopDetails){
    this.props.setLastPosition(this.state.lastPosition);
    this.props.setShopData(this.state.distanceArray);
    this.props.pushRoute({ key: 'shopDetail', data:shopDetails}, this.props.navigation.key);
  }

  openMyProfile (){
    this.props.setLastPosition(this.state.lastPosition);
    this.props.setShopData(this.state.distanceArray);
    this.props.pushRoute({ key: 'myProfile'}, this.props.navigation.key);
  }

  openMyFavorites(){
      this.props.setLastPosition(this.state.lastPosition);
      this.props.setShopData(this.state.distanceArray);
      this.props.pushRoute({ key: 'myFavorite'}, this.props.navigation.key);
  }

  constructor(props) {
    super(props);
    this.state = {
      isSearchMode: false,
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
    homeLocationId:0,
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
console.warn(`fetchCurrentLocation`);
    navigator.geolocation.getCurrentPosition(
    (position) => {

      var initialPosition = position;
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
        this.fetchCurrentLocation()
      }
    } catch (err) {
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
}

componentWillUnmount() {
  navigator.geolocation.clearWatch(this.watchID);
}

replaceRoute(route) {
  this.props.replaceAt('mapView', { key: route }, this.props.navigation.key);
}

getLocationList(){
  console.warn(`getLocationList`);
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
console.warn(`getDistanceBetweenPoints`);
  this.setState({distanceArray: []})
  if(this.state.shopsCoordinates[0]!== undefined){
    var i = 0
    var urlDistance = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins='+this.state.lastPosition.coords.latitude+','+this.state.lastPosition.coords.longitude+'&destinations='

    this.state.shopsCoordinates.map((shopCoordinates)=>{
      if(i < this.state.shopsCoordinates.length - 1){
        urlDistance = urlDistance+shopCoordinates.latitude+','+shopCoordinates.longitude+'|'
      }else{
        urlDistance = urlDistance+shopCoordinates.latitude+','+shopCoordinates.longitude
      }
      i++
    })
    urlDistance = urlDistance+'&mode=driving&key=AIzaSyCUdBK1qZKBI6IDzTl9eT0HW-QEN-YgHqE'
    fetch(urlDistance)
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);

      var index = 0
      let currentArray = []
      responseJson.rows[0].elements.map((element) => {

        if(element.status === 'OK'){
          let distance = element.distance.text
          let shopElement = {'coordinatesObj':this.state.shopsCoordinates[index], 'distance': distance}
          currentArray.push(shopElement)
          // this.setState({isLoading: false, distanceArray: currentArray})
          index++
        } else{

          let shopElement = {'coordinatesObj':this.state.shopsCoordinates[index], 'distance': null}
          currentArray.push(shopElement)
          // this.setState({isLoading: false, distanceArray: currentArray})
          index++
        }
      })

      currentArray.sort((obj1, obj2) => {
        if (obj1.distance > obj2.distance) return 1;
        if (obj1.distance < obj2.distance) return -1;
        return 0;
      })
      this.setState({isLoading: false, distanceArray: currentArray})
    })
    .catch((error) => {
      console.error(error);
    });

  }
}

returnShopCoordinates(){
  console.warn(`returnShopCoordinates`);

  var index = 0
  this.setState({isLoading: true})
    this.state.shops.map((shop) => {
      let url = 'https://maps.googleapis.com/maps/api/geocode/json?address='
      let address =  shop.address + '+' + shop.location
      var fulladdress = address
      fulladdress = fulladdress.replace(/\s/g, "+");
      url = url+fulladdress+'&key=AIzaSyCUdBK1qZKBI6IDzTl9eT0HW-QEN-YgHqE'
      fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {

        console.log(responseJson);

        if(responseJson.results[0] !== undefined && responseJson.status !== 'ZERO_RESULTS'){
            let currentArray = this.state.shopsCoordinates
            let element = {'identifier':marker_identifier, 'latitude': responseJson.results[0].geometry.location.lat, 'longitude': responseJson.results[0].geometry.location.lng, 'title': 'Sweet Cow', image:sweetCow_Marker, 'shop':shop}
            currentArray.push(element)
            this.setState({shopsCoordinates: currentArray})
            index++

          if(index === this.state.shops.length){
            this.focus1();
            this.getDistanceBetweenPoints()
          }
        }
    }).catch((error) => {
      console.error(error);
    });
})
}

openExternalMaps(location){
  openExternalMaps(location,this.state.lastPosition)
}


centerMapAtMyLocation(){
  this.focus1()
  this.getDistanceBetweenPoints()
}

_onRegionChange = (region) => {
  this.setState({
    region: region,
  });
};

getAnimatedMarkers(marker){
  return(
    <Map.Marker
    coordinate={{latitude: this.state.lastPosition.coords.latitude,longitude: this.state.lastPosition.coords.longitude,}}
    identifier={marker.identifier}
    title={marker.title} pointerEvents="none"
    >
    <CustomPulse pointerEvents="none"/>
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


setHomeLocation(locationId){
  try{
    FirDatabase.setHomeLocation(this.props.user.uid, locationId)
    this.setState({homeLocationId: locationId})

    let user = this.props.user
    user.locationId = locationId
    this.setUser(user)
  }
  catch(error){

    this.setState({isLoading: false})
    Alert.alert(
      'Error',
      `${error.toString()}`,
    )
  }
}

setUser(user) {
  this.props.setUser(user);
}


onSearchButtonClicked() {
  if(this.state.isSearchMode == true){
    this.setState({isSearchMode: false})
  }else{
    this.setState({isSearchMode: true})
  }
}

searchDismiss() {
  this.setState({isSearchMode: false})
}



render() {

  let borderwidth = 6
  let deviceHeightDiff = deviceHeight/568.0
  if(deviceHeightDiff > 1){
    deviceHeightDiff += 0.25
  }

  var locList = []



  this.state.distanceArray.map((shop) => {
    if(shop.coordinatesObj.shop !== null){
      if(shop.coordinatesObj.shop.id === this.props.user.locationId)
      locList.push(<ShopLocationCell shop={shop} locationId={this.props.user.locationId} onPress={(location)=>this.openExternalMaps(location)} openShopDetail={(shopDetails)=>this.openShopDetails(shopDetails)}  setHomeLocation={(locationId)=>this.setHomeLocation(locationId)}/> )
    }
  })

  this.state.distanceArray.map((shop) => {
    if(shop.coordinatesObj.shop !== null){
      if(shop.coordinatesObj.shop.id !== this.props.user.locationId)
      locList.push(<ShopLocationCell shop={shop} locationId={this.props.user.locationId} onPress={(location)=>this.openExternalMaps(location)} openShopDetail={(shopDetails)=>this.openShopDetails(shopDetails)}  setHomeLocation={(locationId)=>this.setHomeLocation(locationId)}/> )
    }
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
    <View style={{width: deviceWidth, height: deviceHeight * 0.13, flexDirection:'row'}}>
    <Image source={logoCow} style={{marginLeft: 10, width: deviceWidth/2.2, height: deviceHeight/6.2, alignSelf:'flex-start', marginTop: 0, resizeMode: 'contain'}}/>

    <TouchableOpacity onPress={()=>this.centerMapAtMyLocation()}>
    <View>
    <Image source={map_icon} style={{marginLeft: 25, marginTop: 25, width: deviceWidth/12, height: deviceHeight/12, resizeMode: 'contain'}}/>
    </View>
    </TouchableOpacity>

    <TouchableOpacity onPress={()=>this.onSearchButtonClicked()}>
    <View>
    <Image source={search_icon} style={{marginLeft: 8, marginTop: 25, width: deviceWidth/12, height: deviceHeight/12, resizeMode: 'contain'}}/>
    </View>
    </TouchableOpacity>

    <TouchableOpacity onPress={()=>this.openMyFavorites()}>
    <View>
    <Image source={favorite_icon} style={{marginLeft: 8, marginTop: 25, width: deviceWidth/12, height: deviceHeight/12, resizeMode: 'contain'}}/>
    </View>
    </TouchableOpacity>

    <TouchableOpacity onPress={()=>this.openMyProfile()}>
    <View>
    <Image source={user_icon} style={{marginLeft: 8, marginTop: 25, width: deviceWidth/12, height: deviceHeight/12, resizeMode: 'contain'}}/>
    </View>
    </TouchableOpacity>
    </View>



    <View style={{width: deviceWidth, height: borderwidth,  backgroundColor:'rgba(37, 0, 97, 1)' }}>
    </View>
    <View style={{width: deviceWidth, height: deviceHeight*0.42}}>
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

    <View style={{marginTop:-borderwidth, width: deviceWidth, height: ((deviceHeight * 0.45))}}>
    <View style={{width: deviceWidth, height: borderwidth,  backgroundColor:'rgba(37, 0, 97, 1)' }}>
    </View>
    <View>

    <Text style={{alignSelf:'center', marginTop: 10, fontSize: 25, color: 'rgba(37, 0, 97, 1)', fontFamily:"Trade Gothic LT Std"}}> SHOPS AROUND ME </Text>
    </View>

    <View>

    </View>

    <ScrollView
    automaticallyAdjustContentInsets={false}
    vertical={true} style={{marginBottom: 20}}
    >
    {locList}
    </ScrollView>
    </View>
    <Loading isLoading={this.state.isLoading}/>
    <SearchResults isSearchMode={this.state.isSearchMode} distanceArray={this.state.distanceArray} lastPosition={this.state.lastPosition}
     crossAction={()=>this.searchDismiss()}
    />

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
    setLastPosition: name => dispatch(setLastPosition(name)),
    setShopData: name => dispatch(setShopData(name)),
    popRoute: (key) => dispatch(popRoute(key)),
    pushRoute: (route, key) => dispatch(pushRoute(route, key)),

  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
  user: state.user.name
});

export default connect(mapStateToProps, bindActions)(MapView);
