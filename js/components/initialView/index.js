
import React, { Component } from 'react';
import { Image, Dimensions, Alert, ActivityIndicator, StyleSheet,Animated,Easing, AsyncStorage} from 'react-native';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container, Content, Button, View, Text } from 'native-base';
import TextField from '../base/textField/'
import CustomButton from '../base/button/'

import { setUser } from '../../actions/user';
import * as firebase from "firebase";
import FirDatabase from "../../database/";
import Loading from '../base/loading/'
import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;


const {
  replaceAt,
  pushRoute
} = actions;


const background = require('../../../images/sweet-cow-loading-screen.png');
const loading_Circle = require('../../../images/loading_circle.png');

let percentageLimit = 60

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: deviceWidth,
    height: deviceHeight,
    resizeMode: 'stretch',
    marginLeft:3
  },
  activityIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    marginTop: deviceHeight * 0.85 - 40
  }
});

class InitialView extends Component {

  static propTypes = {
    setUser: React.PropTypes.func,
    replaceAt: React.PropTypes.func,
    navigation: React.PropTypes.shape({
      key: React.PropTypes.string,
    }),
  }

  constructor(props) {
    super(props);
    console.warn('here')
    this.spinValue = new Animated.Value(0)
    this.state = {
      userLoaded: false,
      initialView: null,
      isLoading: false,
      pecentage: 0,
      deviceToken: ''

    };
    this.getDeviceToken()
    this.getInitialView()

    this.getInitialView = this.getInitialView.bind(this);
  }


  getFcmToken(){
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
  async saveDeviceToken (deviceToken){
    if (deviceToken !== undefined && deviceToken !== null){
    try {
      // console.warn('savedevicetoken')

      await AsyncStorage.setItem('@deviceToken:key', deviceToken );
    } catch (error) {
      console.warn(`error ${error}`);
    }
  }
  }

  async getDeviceToken (){

    try {
      const deviceToken = await AsyncStorage.getItem('@deviceToken:key');

      if (deviceToken !== undefined && deviceToken !== null){
        this.setState({deviceToken: deviceToken})
        return deviceToken;
      }
      return "";
    }
    catch (error) {
      console.warn(error);
      return "";
    }
  }

  getInitialView() {

    this.fireBaseListener = firebase.auth().onAuthStateChanged((user) => {

      let initialView = 'mapView'// user ? "mapView" : "home";

      this.setState({
        userLoaded: true,
        initialView: initialView
      })

      this.fireBaseListener()
       if(user){
        this.listenUserData = FirDatabase.listenUserData(user.uid, (userDataVal) => {

          let token = this.state.deviceToken;
          console.warn(`token123`, token)
          FirDatabase.updateUserDeviceToken(user.uid, token)

          this.setState({
            isLoading: false
          })
          if(userDataVal.email == undefined){

          }
          else{

            this.setUser(userDataVal)
            console.warn(userDataVal.locationId);
            if(userDataVal.locationId === -1 || userDataVal.locationId === undefined){
              percentageLimit = 100
            }
            this.replaceRouteToMap(initialView, userDataVal.locationId)
          }
        });
      }
      else{
        this.replaceRouteToMap(initialView, -1)
      }

    });

  }

  componentWillUnmount() {
    this.fireBaseListener = undefined
    this.listenUserData = undefined
    clearInterval(this.timer)
    this.refreshTokenListener.remove();
  }

  componentDidMount () {
    this.getFcmToken()
    this.spin()
    this.startPercentageIncrease()
  }

  spin () {
    this.spinValue.setValue(0)
    Animated.timing(
      this.spinValue,
      {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear
      }
    ).start(() => this.spin())
  }


startPercentageIncrease(){
  this.timer = setInterval(() => {
    this.increasePecentage()
  }, 200);
}

increasePecentage(){
  var percentage = this.state.pecentage
  percentage+= Math.floor(Math.random() * ((percentageLimit/10) - 1)) + 1

  // console.warn(percentage)
   if(percentage <= percentageLimit){
    this.setState({pecentage: percentage})
  }
}

  replaceRoute(route) {
    setTimeout(() => {
      this.props.replaceAt('default', { key: route }, this.props.navigation.key);
    }, 500);
  }

  replaceRouteToMap(route, locationId) {
    // setTimeout(() => {
      this.props.replaceAt('default', { key: route, locationId:locationId }, this.props.navigation.key);
    // }, 100);
  }

  setUser(user) {
    this.props.setUser(user);
  }

  pushRoute(route){
    this.props.pushRoute({ key: route  }, this.props.navigation.key);
  }

  render() {

    var percentageFormatted = this.state.pecentage + '%'


    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    })

    return(
      <Container>
      <Content bounces={false}>

      <Image source={background} style={styles.backgroundImage}>

      <Animated.Image
      style={{
        marginTop: deviceHeight*0.7,
        alignSelf:'center',
        resizeMode: 'contain',
        width: 60,
        height: 60,
        transform: [{rotate: spin}] }}
        source={loading_Circle}
        >
        </Animated.Image>
        <Text style = {{marginTop: -38, fontSize:10,
        alignSelf:'center', color:'white'}}> {percentageFormatted} </Text>
        </Image>

        </Content>
        </Container>
      );

    }
  }

  function bindActions(dispatch) {
    return {
      replaceAt: (routeKey, route, key) => dispatch(replaceAt(routeKey, route, key)),
      pushRoute: (route, key) => dispatch(pushRoute(route, key)),
      setUser: user => dispatch(setUser(user)),
    };
  }

  const mapStateToProps = state => ({
    navigation: state.cardNavigation,
  });

  export default connect(mapStateToProps, bindActions)(InitialView);
