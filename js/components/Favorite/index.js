
import React, { Component } from 'react';
import { Image, Dimensions, Alert, ActivityIndicator, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container, Content, Button, View, Text } from 'native-base';
import { setUser } from '../../actions/user';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const info_Icon = require('../../../images/Info_Icon.png');
const cross_Icon = require('../../../images/Cross_Icon.png');
const user_icon = require('../../../images/user-icon.png');
const background = require('../../../images/background_ShopDetails.png');
const allergies_Icon = require('../../../images/Allergies_Icon.png');
const favorite_Icon = require('../../../images/Favorite_Icon.png');


const {
  replaceAt,
  popRoute,
  pushRoute,
} = actions;

class MyFavorite extends Component {

  static propTypes = {
    navigation: React.PropTypes.shape({
      key: React.PropTypes.string,
      replaceAt: React.PropTypes.func,
      pushRoute: React.PropTypes.func,
      popRoute: React.PropTypes.func,
    }),
  }

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {

  }

  pushRoute(route) {
    this.props.pushRoute({ key: route }, this.props.navigation.key);
  }

  popRoute() {
    this.props.popRoute(this.props.navigation.key);
  }

  render() {

    let borderwidth = 6
    return (

    );
  }
}

function bindActions(dispatch) {
  return {
    replaceAt: (routeKey, route, key) => dispatch(replaceAt(routeKey, route, key)),
    setUser: name => dispatch(setUser(name)),
    popRoute: (key) => dispatch(popRoute(key)),
    pushRoute: (route, key) => dispatch(pushRoute(route, key)),
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
  user: state.user.name
});

export default connect(mapStateToProps, bindActions)(MyFavorite);
