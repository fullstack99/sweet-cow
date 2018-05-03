
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
import HomeLocationLoading from '../base/HomeLocationLoading/'
import { openExternalMaps } from '../../utils/';
import SearchResults from "../SearchScreen/SearchResults"
import { setUser } from '../../actions/user';
import { setShopData } from '../../actions/shopData';
import { setSearchData } from '../../actions/searchData';
import { setAppInfoData } from '../../actions/appInfoData';
import { setLastPosition } from '../../actions/lastPosition';
import FCM, { FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType } from 'react-native-fcm';


import CustomPulse from './pulse'

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const {
  replaceAt,
  popRoute,
  pushRoute,
} = actions;

let cellHeightArr = []

const background = require('../../../images/background_login.png');
const logoCow = require('../../../images/logo_cow_horizontal.png');
const map_icon = require('../../../images/map-locator.png');
const search_icon = require('../../../images/search-icon.png');
const favorite_icon = require('../../../images/favorite-icon.png');
const user_icon = require('../../../images/user-icon.png');
const sweetCow_Marker = require('../../../images/SweetCow-marker.png');
const sweetCow_MarkerSelected = require('../../../images/map-markerSelected.png');
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

var isDistanceFetchCalled = false

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

  pushRoute(route) {
    this.props.setLastPosition(this.state.lastPosition);
    this.props.setShopData(this.state.distanceArray);
    this.props.pushRoute({ key: route }, this.props.navigation.key);
  }

  openShopDetails(shopDetails) {
    this.props.setLastPosition(this.state.lastPosition);
    this.props.setShopData(this.state.distanceArray);
    this.props.pushRoute({ key: 'shopDetail', data: shopDetails }, this.props.navigation.key);
  }

  openMyProfile() {
    this.props.setLastPosition(this.state.lastPosition);
    this.props.setShopData(this.state.distanceArray);
    this.props.pushRoute({ key: 'myProfile' }, this.props.navigation.key);
  }

  openMyFavorites() {
    if (this.props.user) {
      this.props.setLastPosition(this.state.lastPosition);
      this.props.setShopData(this.state.distanceArray);
      this.props.pushRoute({ key: 'myFavorite' }, this.props.navigation.key);
    } else {
      this.loginConfimation()
    }

  }


  getFcmToken() {
    FCM.setBadgeNumber(0);
    FCM.requestPermissions(); // for iOS
    FCM.getFCMToken().then(token => {
      console.log(token)
      console.warn(`token`, token)
      this.saveDeviceToken(token)

      //   Alert.alert(
      //   'Token',
      //   token,
      // )
      // store fcm token in your server
    });

    this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, (token) => {
      console.log(token)
      console.warn(`token`, token)
      this.saveDeviceToken(token)
      //   Alert.alert(
      //   'Token',
      //   token,
      // )
      //   // fcm token may not be available on first load, catch it here
    });
  }

  //To save the deviceToken
  async saveDeviceToken(deviceToken) {
    if (deviceToken !== undefined && deviceToken !== null) {
      try {
        // console.warn('savedevicetoken')

        await AsyncStorage.setItem('@deviceToken:key', deviceToken);
      } catch (error) {
        console.warn(`error ${error}`);
      }
    }
  }

  async getDeviceToken() {

    try {
      const deviceToken = await AsyncStorage.getItem('@deviceToken:key');

      if (deviceToken !== undefined && deviceToken !== null) {
        this.setState({ deviceToken: deviceToken })
        return deviceToken;
      }
      return "";
    }
    catch (error) {
      console.warn(error);
      return "";
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      selectedMarkerTitle: "",
      isInitialView: true,
      isSearchMode: false,
      isLoading: false,
      initialPosition: undefined,
      lastPosition: {
        coords: {
          latitude: 339.977755,
          longitude: -105.134582,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }

      },
      shops: [],
      shopsCoordinates: [],
      distanceArray: [],
      homeLocationId: 0,
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

    this.getFcmToken()

    setTimeout(() => {
      this.getCurrentLocationIfPermission()

    }, 1000);

  }

  gotoSettings() {

    Linking.canOpenURL('app-settings:').then(supported => {
      if (!supported) {
        console.log('Can\'t handle settings url');
      } else {
        return Linking.openURL('app-settings:');
      }
    }).catch(err => console.error('An error occurred', err));
  }

  fetchCurrentLocation() {
    // console.warn(`fetchCurrentLocation`);
    if (this.props.locationId !== -1 && this.props.locationId !== undefined) {
      this.setState({ isInitialView: true })
    } else {
      this.setState({ isInitialView: false })
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {

        var initialPosition = position;
        let region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }
        this.setState({ initialPosition })
        this.setState({ region })

        var lastPosition = position;
        this.setState({ lastPosition });
        this.getLocationList()
      },
      (error) => {
        this.getLocationList()
        // alert(JSON.stringify(error))
        if (Platform.OS !== 'android') {
          Alert.alert(
            'Alert',
            'If you do not allow location or push notifications, you will not be able to see the shops around you or be notified when your favorite flavors become available. Go to settings to allow location and push notifications access.',
            [
              { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
              { text: 'Settings', onPress: () => this.gotoSettings() },
            ],
            { cancelable: false }
          )
        }
        else {
          Alert.alert(
            'Alert',
            'If you do not allow location or push notifications, you will not be able to see the shops around you or be notified when your favorite flavors become available. Go to settings to allow location and push notifications access.',
            [
              { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
              { text: 'Settings', onPress: () => this.gotoSettings() },
            ],
            { cancelable: false }
          )
        }


      },
      { enableHighAccuracy: false, timeout: 20000 }
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      var lastPosition = position;

      let prevPos = this.state.lastPosition;
      var shouldReload = false;
      let distance = this.distance(prevPos.coords.latitude, prevPos.coords.longitude, position.coords.latitude, position.coords.longitude, "M");
      // console.warn(`distance`, distance);
      if (distance > 0.5) {
        this.setState({ lastPosition });
        this.centerMapAtMyLocation()
      }
    });
  }




  async getCurrentLocationIfPermission() {
    this.setState({ isLoading: true })

    if (Platform.OS !== 'android') {
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


  componentWillMount() {
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  replaceRoute(route) {
    this.props.replaceAt('mapView', { key: route }, this.props.navigation.key);
  }

  getLocationList() {
    // console.warn(`getLocationList`);
    // fetch('http://www.theanalect.com/DEMOS/sweetcow/api.php')
    this.setState({ isLoading: true })

    fetch('https://sweetcowicecream.com/api.v2.php')
      .then((response) => response.json())
      .then((responseJson) => {
        
        let shopsArray = []
        let searchShopArray = []
        let appInfoArray = []
        if(responseJson && responseJson !== undefined){
          responseJson.map((shop) => {
            if (shop.storeId !== undefined) {
              if (shop.storeId.toUpperCase().includes('APP - Do Not Touch'.toUpperCase())) {
                // console.warn(shop.storeId);
                // let shopElement = { 'location': shop.storeId, 'address': shop.shortaddress, 'flavors': shop.store_data, 'hours': null, 'id': shop.storeId, 'phone': shop.phone1, 'state': shop.state, 'zip_code': shop.postalCode, 'dayhourseconds': shop.dayhourseconds, 'dayhours': shop.dayhours, 'city': shop.city }
                // searchShopArray.push(shopElement)
  
              } else {
                let shopElement = { 'location': shop.storeId, 'address': shop.shortaddress, 'flavors': shop.store_data, 'hours': null, 'id': shop.storeId, 'phone': shop.phone1, 'state': shop.state, 'zip_code': shop.postalCode, 'dayhourseconds': shop.dayhourseconds, 'dayhours': shop.dayhours, 'city': shop.city }
                shopsArray.push(shopElement)
                searchShopArray.push(shopElement)
              }
            } else {
              let shopElement = { 'homeImageUrl': shop.app_info_content.home_initial_image, 'promoMessage': shop.app_info_content.promo_message }
              appInfoArray.push(shopElement)
              console.warn(shop.app_info_content.home_initial_image);
  
            }
  
          })
        } else{
          this.setState({ isLoading: false })
          return null
        }
      
        this.setState({ isLoading: true, shops: shopsArray })
        this.props.setSearchData(searchShopArray);
        this.props.setAppInfoData(appInfoArray);

        //Getting location corrdinates
        let element = { 'identifier': marker_identifier, 'latitude': this.state.lastPosition.coords.latitude, 'longitude': this.state.lastPosition.coords.longitude, 'title': "Current Position", 'image': null, 'shop': null }
        let currentArray = this.state.shopsCoordinates
        currentArray.push(element)
        this.setState({ shopsCoordinates: currentArray })
        this.returnShopCoordinates()

      })
      .catch((error) => {
        console.error(error);
      });
  }

  getDistanceBetweenPoints() {
    // console.warn(`getDistanceBetweenPoints`);
    this.setState({ distanceArray: [] })
    if (this.state.shopsCoordinates[0] !== undefined) {
      var i = 0
      var urlDistance = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=' + this.state.lastPosition.coords.latitude + ',' + this.state.lastPosition.coords.longitude + '&destinations='
      console.log(this.state.shopsCoordinates);
      this.state.shopsCoordinates.map((shopCoordinates) => {
        if (i < this.state.shopsCoordinates.length - 1) {
          urlDistance = urlDistance + shopCoordinates.latitude + ',' + shopCoordinates.longitude + '|'
        } else {
          urlDistance = urlDistance + shopCoordinates.latitude + ',' + shopCoordinates.longitude
        }
        i++
      })
      // urlDistance = urlDistance+'&mode=driving&key=AIzaSyCUdBK1qZKBI6IDzTl9eT0HW-QEN-YgHqE'
      urlDistance = urlDistance + '&mode=driving&key=AIzaSyDln7OOdOV2G0Kw3t8VvKKMmH1SUSUv3Vs'

      isDistanceFetchCalled = true
      fetch(urlDistance)
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          isDistanceFetchCalled = false

          var index = 0
          let currentArray = []
          let shopObj = null

          responseJson.rows[0].elements.map((element) => {

            // console.log(responseJson);
            if (element.status === 'OK') {

              let distance = element.distance.text
              let distanceVal = element.distance.value
              let shopElement = { 'coordinatesObj': this.state.shopsCoordinates[index], 'distance': distance, 'distanceValue': distanceVal }
              currentArray.push(shopElement)

              if (this.state.shopsCoordinates[index].shop !== null && this.state.shopsCoordinates[index].shop.id === this.props.locationId) {
                shopObj = shopElement
              }
              index++
            } else {

              let shopElement = { 'coordinatesObj': this.state.shopsCoordinates[index], 'distance': null, 'distanceValue': 0 }
              currentArray.push(shopElement)
              if (this.state.shopsCoordinates[index].shop !== null && this.state.shopsCoordinates[index].shop.id === this.props.locationId) {
                shopObj = shopElement
              }
              index++
            }
          })

          currentArray.sort((obj1, obj2) => {

            if (obj1.distanceValue > obj2.distanceValue) {
              // console.warn(`greater`, obj1.distanceValue, obj2.distanceValue);
              return 1;
            }

            if (obj1.distanceValue < obj2.distanceValue) {
              // console.warn(`less`, obj1.distanceValue, obj2.distanceValue);
              return -1;
            }
            // console.warn(`equal`, obj1.distanceValue, obj2.distanceValue);
            return 0;
          })

          this.setState({ isLoading: false, distanceArray: currentArray })
          if ((this.props.locationId !== -1 && this.props.locationId !== undefined) && this.state.isInitialView === true) {
            this.openShopDetails(shopObj)
            setTimeout(() => {
              this.setState({ isInitialView: false })
            }, 500);
          }
        })
        .catch((error) => {
          console.error(error);
        });

    }
  }

  returnShopCoordinates() {
    // console.warn(`returnShopCoordinates`);

    var index = 0
    this.setState({ isLoading: true })
    this.state.shops.map((shop) => {
      let url = 'https://maps.googleapis.com/maps/api/geocode/json?address='
      let address = shop.address + '+' + shop.state + '+' + shop.zip_code
      var fulladdress = address
      fulladdress = fulladdress.replace(/\s/g, "+");
      url = url + fulladdress + '&key=AIzaSyDln7OOdOV2G0Kw3t8VvKKMmH1SUSUv3Vs'
      fetch(url)
        .then((response) => response.json())
        .then((responseJson) => {

          console.log(responseJson);

          if (responseJson.results[0] !== undefined && responseJson.status !== 'ZERO_RESULTS') {
            let currentArray = this.state.shopsCoordinates
            let element = { 'identifier': marker_identifier, 'latitude': responseJson.results[0].geometry.location.lat, 'longitude': responseJson.results[0].geometry.location.lng, 'title': shop.location, image: sweetCow_Marker, 'shop': shop }
            currentArray.push(element)
            this.setState({ shopsCoordinates: currentArray })
            index++

            if (index === this.state.shops.length) {
              this.focus1();
              this.getDistanceBetweenPoints()
            }
          }
        }).catch((error) => {
          console.error(error);
        });
    })
  }

  openExternalMaps(location) {
    openExternalMaps(location, this.state.lastPosition)
  }


  centerMapAtMyLocation() {
    if (isDistanceFetchCalled) {
      return;
    }

    this.focus1()
    this.getDistanceBetweenPoints()
  }

  logoClicked() {
    console.warn('logoClicked')
    console.warn(this.props.user.locationId)
    if (this.props.user.locationId !== -1 && this.props.user.locationId !== undefined) {
      console.warn(this.props.user.locationId)
      this.state.distanceArray.map((shop) => {
        if (shop.coordinatesObj.shop !== null) {
          console.warn(this.props.user.locationId)
          if (shop.coordinatesObj.shop.id === this.props.user.locationId)
            this.openShopDetails(shop)
        }
      })
    }
  }

  _onRegionChange = (region) => {

    this.setState({
      region: region,
    });

  };


  distance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1 / 180
    var radlat2 = Math.PI * lat2 / 180
    var theta = lon1 - lon2
    var radtheta = Math.PI * theta / 180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    if (unit == "K") { dist = dist * 1.609344 }
    if (unit == "N") { dist = dist * 0.8684 }
    return dist
  }

  getAnimatedMarkers(marker) {
    return (
      <Map.Marker
        coordinate={{ latitude: this.state.lastPosition.coords.latitude, longitude: this.state.lastPosition.coords.longitude, }}
        identifier={marker.identifier}
        title={marker.title} pointerEvents="none"
      >
        <CustomPulse pointerEvents="none" />
      </Map.Marker>
    )
  }


  markerClicked(marker) {

    let index = -1
    let shopIndex = -1
    var markerTitle = ""
    if (this.props.user.locationId === -1 || this.props.user.locationId === undefined) {
      this.state.distanceArray.map((shop) => {
        if (shop.coordinatesObj.shop !== null) {
          index++
          if (shop.coordinatesObj.shop.id === marker.title) {
            shopIndex = index
            markerTitle = marker.title
          }
        }
      })
    } else {
      if (this.props.user.locationId === marker.title) {
        shopIndex = 0
        markerTitle = marker.title
      } else {
        index++
        this.state.distanceArray.map((shop) => {
          if (shop.coordinatesObj.shop !== null) {
            index++
            if (this.props.user.locationId === shop.coordinatesObj.shop.id) {
              index--
            }

            if (shop.coordinatesObj.shop.id === marker.title) {
              shopIndex = index
              markerTitle = marker.title
            }
          }
        })
      }
    }
    //iPhone5 21

    let totalHeight = 0;

    //shopIndex

    for (var i = 0; i < shopIndex; i++) {
      let height = cellHeightArr[i]
      totalHeight += height
    }

    this.scrollview.scrollTo({ x: 0, y: totalHeight, animated: true })
    this.setState({ selectedMarkerTitle: markerTitle })
  }

  getMarkers(marker) {

    let imgSource = marker.image
    if (marker.title === this.state.selectedMarkerTitle) {
      imgSource = sweetCow_MarkerSelected
    }

    return (

      <Map.Marker onPress={() => this.markerClicked(marker)}
        coordinate={{ latitude: marker.latitude, longitude: marker.longitude, }}
        identifier={marker.identifier}
        title={marker.title}
        image={imgSource}
      />
    )
  }


  setHomeLocation(locationId) {

    if (this.props.user) {
      try {
        FirDatabase.setHomeLocation(this.props.user.uid, locationId)
        this.setState({ homeLocationId: locationId })

        let user = this.props.user
        user.locationId = locationId
        this.setUser(user)
      }
      catch (error) {

        this.setState({ isLoading: false })
        Alert.alert(
          'Error',
          `${error.toString()}`,
        )
      }

    } else {
      this.loginConfimation()
    }

  }

  loginConfimation() {
    Alert.alert(
      'Confirm',
      'This action requires login, do you want to login or create an account?',
      [
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: 'Yes', onPress: () => this.goToLogin() },
      ],
      { cancelable: false }
    )
  }


  goToLogin() {
    this.props.pushRoute({ key: 'home' }, this.props.navigation.key);
  }

  setUser(user) {
    this.props.setUser(user);
  }


  onSearchButtonClicked() {
    if (this.state.isSearchMode == true) {
      this.setState({ isSearchMode: false })
    } else {
      this.setState({ isSearchMode: true })
    }
  }

  searchDismiss() {
    this.setState({ isSearchMode: false })
  }

  addInitialView() {
    return (
      <HomeLocationLoading isLoading={this.state.isInitialView} />
    )
  }

  shopCellSizeCallback(index, rect) {
    if (index < cellHeightArr.length) {
      cellHeightArr[index] = rect.height
    }
  }


  render() {

    console.warn(`usersss`, this.props.user);

    let borderwidth = 6
    let deviceHeightDiff = deviceHeight / 568.0
    if (deviceHeightDiff > 1) {
      deviceHeightDiff += 0.25
    }

    var locList = []

    let initialView = this.addInitialView()

    var index = 0;
    this.state.distanceArray.map((shop) => {
      if (shop.coordinatesObj.shop !== null) {
        if (shop.coordinatesObj.shop.id === this.props.user.locationId) {
          locList.push(<ShopLocationCell index={index} cellSizeCallback={(index, rect) => this.shopCellSizeCallback(index, rect)} shop={shop} locationId={this.props.user.locationId} onPress={(location) => this.openExternalMaps(location)} openShopDetail={(shopDetails) => this.openShopDetails(shopDetails)} setHomeLocation={(locationId) => this.setHomeLocation(locationId)} />)
          index += 1
          cellHeightArr.push(0)
        }
      }
    })

    this.state.distanceArray.map((shop) => {
      if (shop.coordinatesObj.shop !== null) {
        if (shop.coordinatesObj.shop.id !== this.props.user.locationId) {
          locList.push(<ShopLocationCell shop={shop} index={index} cellSizeCallback={(index, rect) => this.shopCellSizeCallback(index, rect)} locationId={this.props.user.locationId} onPress={(location) => this.openExternalMaps(location)} openShopDetail={(shopDetails) => this.openShopDetails(shopDetails)} setHomeLocation={(locationId) => this.setHomeLocation(locationId)} />)
          index += 1
          cellHeightArr.push(0)
        }

      }
    })

    var markers = []
    this.state.shopsCoordinates.map(marker => {
      if (marker.image !== null) {
        markers.push(this.getMarkers(marker))
      } else {
        markers.push(this.getAnimatedMarkers(marker))
      }

    })


    return (
      <Container style={{ marginLeft: 3 }}>

        <View style={{}}>
          <View style={{ width: deviceWidth, height: deviceHeight * 0.13, flexDirection: 'row' }}>
            <TouchableOpacity onPress={() => this.logoClicked()}>
              <Image source={logoCow} style={{ marginLeft: 10, width: deviceWidth / 2.2, height: deviceHeight / 6.2, alignSelf: 'flex-start', marginTop: 0, resizeMode: 'contain' }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.centerMapAtMyLocation()}>
              <View>
                <Image source={map_icon} style={{ marginLeft: 25, marginTop: 25, width: deviceWidth / 12, height: deviceHeight / 12, resizeMode: 'contain' }} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.onSearchButtonClicked()}>
              <View>
                <Image source={search_icon} style={{ marginLeft: 8, marginTop: 25, width: deviceWidth / 12, height: deviceHeight / 12, resizeMode: 'contain' }} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.openMyFavorites()}>
              <View>
                <Image source={favorite_icon} style={{ marginLeft: 8, marginTop: 25, width: deviceWidth / 12, height: deviceHeight / 12, resizeMode: 'contain' }} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.openMyProfile()}>
              <View>
                <Image source={user_icon} style={{ marginLeft: 8, marginTop: 25, width: deviceWidth / 12, height: deviceHeight / 12, resizeMode: 'contain' }} />
              </View>
            </TouchableOpacity>
          </View>



          <View style={{ width: deviceWidth, height: deviceHeight * 0.42, borderColor: 'rgba(37, 0, 97, 1)', borderWidth: borderwidth }}>
            <Text style={{ alignSelf: 'center', marginTop: 50 }}> Map view here </Text>
            <Map
              provider={this.props.provider}
              ref={ref => { this.map = ref; }}
              region={this.state.region}
              style={styles.map}
              onRegionChange={this._onRegionChange}
            >
              {markers}
            </Map>
          </View>
        </View>

        <View style={{ marginTop: borderwidth, width: deviceWidth, height: ((deviceHeight * 0.45)) }}>

          <View>
            <Text style={{ alignSelf: 'center', marginTop: 10, fontSize: 25, color: 'rgba(37, 0, 97, 1)', fontFamily: "Trade Gothic LT Std" }}> SHOPS AROUND ME </Text>
          </View>


          <ScrollView ref={ref => { this.scrollview = ref; }}
            onScroll={() => {
              console.warn("onScroll")
            }}
            automaticallyAdjustContentInsets={false}
            vertical={true} style={{ marginBottom: 10 }}
          >
            {locList}
          </ScrollView>
        </View>

        <Loading isLoading={this.state.isLoading} />
        <SearchResults isSearchMode={this.state.isSearchMode} distanceArray={this.state.distanceArray} lastPosition={this.state.lastPosition}
          crossAction={() => this.searchDismiss()}
        />

        {initialView}

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
    setSearchData: name => dispatch(setSearchData(name)),
    setAppInfoData: name => dispatch(setAppInfoData(name)),
    popRoute: (key) => dispatch(popRoute(key)),
    pushRoute: (route, key) => dispatch(pushRoute(route, key)),

  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
  user: state.user.name
});

export default connect(mapStateToProps, bindActions)(MapView);
