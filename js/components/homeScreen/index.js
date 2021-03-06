
import React, { Component } from 'react';
import { Image, Dimensions, StyleSheet, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container, Content, Button, View, Text } from 'native-base';
import TextField from '../base/textField/'
import CustomButton from '../base/button/'
import FCM, { FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType } from 'react-native-fcm';

import { setUser } from '../../actions/user';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const {
  replaceAt,
} = actions;

const background = require('../../../images/background_home.png');
const logoCow = require('../../../images/Blue_Sweet_cow_logo.png');
const logo_title = require('../../../images/logo_title_home.png');


const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: deviceWidth,
    height: deviceHeight,
    resizeMode: 'cover',
    marginLeft: 3
  },
  logoCow: {
    width: deviceWidth / 2,
    height: deviceHeight / 4,
    alignSelf: 'center',
    marginTop: 50,
    resizeMode: 'contain'
  },
  logoTitle: {
    width: deviceWidth / 1.7,
    height: deviceHeight / 6,
    alignSelf: 'center',
    marginTop: 0,
    resizeMode: 'contain'
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

class HomeScreen extends Component {

  static propTypes = {
    replaceAt: React.PropTypes.func,
    navigation: React.PropTypes.shape({
      key: React.PropTypes.string,
    }),
  }

  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
    this.refreshTokenListener.remove();
  }

  componentDidMount() {
    this.getFcmToken()
  }

  getFcmToken() {
    FCM.setBadgeNumber(0);
    FCM.requestPermissions(); // for iOS
    FCM.getFCMToken().then(token => {
      console.log(token)
      console.warn(`token`, token)
      this.saveDeviceToken(token)
    });

    this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, (token) => {
      console.log(token)
      console.warn(`token`, token)
      this.saveDeviceToken(token)
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


  replaceRoute(route) {
    this.props.replaceAt('home', { key: route }, this.props.navigation.key);
  }

  render() {

    // console.warn(this.props.appInfoData[0].homeImageUrl);

    let imageUrl = ''
    if (this.props.appInfoData && this.props.appInfoData[0].homeImageUrl && this.props.appInfoData[0].homeImageUrl !== null) {
      imageUrl = { uri: this.props.appInfoData[0].homeImageUrl }
    }


    return (
      <Container>
        <Content bounces={false}>

          <Image source={imageUrl} style={styles.backgroundImage}>
            <Image source={logoCow} style={styles.logoCow} />
            <Image source={logo_title} style={styles.logoTitle} />
            <View style={{ marginTop: deviceHeight * 0.045 }}>
              <CustomButton width={deviceWidth * 0.6} text="SIGN UP" backgroundColor="#5B82B8" onPress={() => this.replaceRoute("signup")} />
            </View>
            <View style={{ marginTop: 20 }}>
              <CustomButton width={deviceWidth * 0.6} text="LOGIN" backgroundColor="#5B82B8" onPress={() => this.replaceRoute("login")} />
            </View>
          </Image>

        </Content>
      </Container>
    );
  }
}

function bindActions(dispatch) {
  return {
    replaceAt: (routeKey, route, key) => dispatch(replaceAt(routeKey, route, key)),
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
  appInfoData: state.appInfoData.name,
});

export default connect(mapStateToProps, bindActions)(HomeScreen);
