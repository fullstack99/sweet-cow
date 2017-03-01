
import React, { Component } from 'react';
import { BackAndroid, StatusBar, NavigationExperimental } from 'react-native';
import { connect } from 'react-redux';
import { Drawer } from 'native-base';
import { actions } from 'react-native-navigation-redux-helpers';
import SideBar from './components/sideBar';

import { closeDrawer } from './actions/drawer';

import Dummy from './components/base/dummy';
import Login from './components/login/';
import SignUp from './components/signup/';
import HomeScreen from './components/homeScreen/';
import MapView from './components/mapView/';
import InitialView from './components/initialView/';
import { statusBarColor } from './themes/base-theme';
import * as firebase from "firebase";

const {
  popRoute,
  replaceAt
} = actions;

const {
  CardStack: NavigationCardStack,
} = NavigationExperimental;

class AppNavigator extends Component {

  static propTypes = {
    drawerState: React.PropTypes.string,
    popRoute: React.PropTypes.func,
    closeDrawer: React.PropTypes.func,
    navigation: React.PropTypes.shape({
      key: React.PropTypes.string,
      routes: React.PropTypes.array,
    }),
  }



  constructor(props){
    super(props)

    firebase.initializeApp({
  //     apiKey: "AIzaSyC8D1CA3tzwOocmUnhkusTM_fDBFslc07A",
  //     authDomain: "sweet-cow-df10d.firebaseapp.com",
  //     databaseURL: "https://sweet-cow-df10d.firebaseio.com",
  //     storageBucket: "sweet-cow-df10d.appspot.com"
  apiKey: "AIzaSyDYCgxzOJfLEQG3HWxivN3V8bqURRf4apc",
   authDomain: "sweet-cow-f5290.firebaseapp.com",
   databaseURL: "https://sweet-cow-f5290.firebaseio.com",
   storageBucket: "sweet-cow-f5290.appspot.com",

    });



  }


  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', () => {
      const routes = this.props.navigation.routes;

      if (routes[routes.length - 1].key === 'home') {
        return false;
      }

      this.props.popRoute(this.props.navigation.key);
      return true;
    });
  }

  componentDidUpdate() {
    if (this.props.drawerState === 'opened') {
      this.openDrawer();
    }

    if (this.props.drawerState === 'closed') {
      this.props.closeDrawer();
    }
  }

  popRoute() {
    this.props.popRoute();
  }

  openDrawer() {
    this._drawer.open();
  }

  closeDrawer() {
    if (this.props.drawerState === 'opened') {
      this.props.closeDrawer();
    }
  }

  _renderScene(props) { // eslint-disable-line class-methods-use-this


    // console.warn(props.scene.route.key)

    switch (props.scene.route.key) {
      case "login":
          return <Login/>
      case "signup":
          return <SignUp />
      case "mapView":
          return <MapView />
      case "home":
        return <HomeScreen />

      default:
          return <InitialView />

    }



  }

  render() {




      return (
        <Drawer
          ref={(ref) => { this._drawer = ref; }}
          type="overlay"
          tweenDuration={150}
          content={<SideBar />}
          tapToClose
          acceptPan={false}
          onClose={() => this.closeDrawer()}
          openDrawerOffset={0.2}
          panCloseMask={0.2}
          styles={{
            drawer: {
              shadowColor: '#000000',
              shadowOpacity: 0.8,
              shadowRadius: 3,
            },
          }}
          tweenHandler={(ratio) => {  //eslint-disable-line
            return {
              drawer: { shadowRadius: ratio < 0.2 ? ratio * 5 * 5 : 5 },
              main: {
                opacity: (2 - ratio) / 2,
              },
            };
          }}
          negotiatePan
        >
          <StatusBar
            backgroundColor={statusBarColor}
            barStyle="default"
          />
          <NavigationCardStack
            navigationState={this.props.navigation}
            renderOverlay={this._renderOverlay}
            renderScene={this._renderScene}
          />
        </Drawer>
      );



  }
}

function bindAction(dispatch) {
  return {
    closeDrawer: () => dispatch(closeDrawer()),
    popRoute: key => dispatch(popRoute(key)),
    replaceAt: (routeKey, route, key) => dispatch(replaceAt(routeKey, route, key)),
  };
}

const mapStateToProps = state => ({
  drawerState: state.drawer.drawerState,
  navigation: state.cardNavigation,
});

export default connect(mapStateToProps, bindAction)(AppNavigator);
