
import React, { Component } from 'react';
import { Image, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container, Content, Button, View, Text } from 'native-base';
import TextField from '../base/textField/'
import CustomButton from '../base/button/'

import { setUser } from '../../actions/user';
import * as firebase from "firebase";
import FirDatabase from "../../database/";
import Loading from '../base/loading/'

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;



const {
  replaceAt,
  pushRoute
} = actions;



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
    this.state = {
      userLoaded: false,
      initialView: null,
      isLoading: false
    };
    this.getInitialView()
    this.getInitialView = this.getInitialView.bind(this);
  }

  getInitialView() {

    this.fireBaseListener = firebase.auth().onAuthStateChanged((user) => {

      let initialView = user ? "mapView" : "home";

      this.setState({
        userLoaded: true,
        initialView: initialView
      })

      this.fireBaseListener()
      if(user){
        // Listen for UserData Changes
        // this.setState({
        //   isLoading: true
        // })
        //
        //   FirDatabase.listenUserData(user.uid, (userDataVal) => {
        //       this.setState({
        //         isLoading: false
        //       })
        //       if(userDataVal.email == undefined || userDataVal.email == ""){
        //         Alert.alert(
        //           'Error',
        //           '',
        //         )
        //       }
        //       else{
        //         this.setUser(userDataVal)
        //         this.replaceRoute(initialView)
        //       }
          // });
          this.replaceRoute(initialView)
      }
      else{
        this.replaceRoute(initialView)
      }

    });

  }

  componentWillUnmount() {
    this.fireBaseListener = undefined
  }


  replaceRoute(route) {
    setTimeout(() => {
        this.props.replaceAt('default', { key: route }, this.props.navigation.key);
    }, 150);

  }

  setUser(user) {
    this.props.setUser(user);
  }

  pushRoute(route){
    this.props.pushRoute({ key: route  }, this.props.navigation.key);
  }

  render() {
      if (this.state.userLoaded) {
        return(
          <Container>
            <Content bounces={false}>
            <Loading isLoading={this.state.isLoading}/>
            </Content>
          </Container>
        );

      }
      else{
        return null
      }

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
