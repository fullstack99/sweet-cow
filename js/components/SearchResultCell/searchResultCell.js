import React, { Component } from 'react';
import { Text, Dimensions, Image, TouchableOpacity } from 'react-native';
import { Container, Content, Button, View, ListItem } from 'native-base';
import { toTitleCase } from '../../utils/';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const miles_icon = require('../../../images/miles-away-icon.png');
const home_icon = require('../../../images/home-icon.png');
const favorite_Icon = require('../../../images/like.png');
const favorited_Icon = require('../../../images/liked.png');


export default class SearchResultCell extends Component {

  static propTypes = {
    shop: React.PropTypes.object
  }


  getAvailableFlavours(fulladdress, distanceFormatted) {
    return (
      <TouchableOpacity style={{ flexDirection: 'row', width: deviceWidth * 0.63 }} onPress={() => this.props.onPress(fulladdress)}>
        <Image source={miles_icon} style={{ marginTop: 3, width: deviceWidth / 22, height: deviceWidth / 22, resizeMode: 'contain' }} />
        <Text style={{ marginTop: 2, marginBottom: 10, alignSelf: 'center', fontSize: 15, textDecorationLine: 'underline', fontFamily: 'ProximaNova-Regular', color: 'rgba(37, 0, 97, 1)' }}>  {distanceFormatted}</Text>
      </TouchableOpacity>
    )
  }

  getUnavailableFlavors(fulladdress, distanceFormatted) {
    return (
      <View style={{}}>
        <Text style={{ fontSize: 15, marginTop: 5, fontFamily: 'ProximaNova-Regular', color: 'rgba(37, 0, 97, 1)' }}>  Flavor currently unavailable</Text>
      </View>

    )
  }

  render() {
    let shop = this.props.shop
    let distance = this.props.distance
    if (this.props.isAvailable) {
      if (distance === null) {
        distance = ''
      } else {
        var res = distance.replace("mi", "Miles");
        res = res.replace("ft", "Feets");
        distance = res
      }
    }


    let borderwidth = 6

    let fulladdress = shop.address + '+' + shop.location + ',+' + shop.state + '+' + shop.zip_code

    let shopID = 'unavailable'
    if (shop && shop.id) {
      shopID = shop.id
    }

    let element = { flavorName: this.props.flavorData.flavor, shopId: shopID, isFavorite: this.props.isFavorite, key: this.props.favKey }

    let onPress = () => this.props.changeFavorites(element)
    let favoriteImage = favorite_Icon
    if (this.props.isFavorite === true) {
      // onPress = null
      favoriteImage = favorited_Icon
    }

    let flavorName = toTitleCase(this.props.flavorData.flavor)
    let distanceFormatted = toTitleCase(distance + ' @ ' + shop.location)

    let flavorColor = '#' + ((this.props.flavorData.color.split('x'))[1])


    let secondRow = null
    if (this.props.isAvailable === true) {
      secondRow = this.getAvailableFlavours(fulladdress, distanceFormatted)
    } else {
      secondRow = this.getUnavailableFlavors()
    }

    return (

      <TouchableOpacity style={{ alignSelf: 'center', borderWidth: borderwidth / 2, borderColor: 'rgba(63, 57, 19, 1)', width: deviceWidth * 0.85, marginTop: 5 }} onPress={() => this.props.openFlavorInfo(this.props.flavorData, this.props.shop, this.props.isFavorite)}>

        <View style={{ marginRight: 15, marginLeft: 15, flexDirection: 'row', marginBottom: 5, justifyContent: 'space-between' }}>

          <View style={{ flexDirection: 'column' }}>
            <Text style={{ width: deviceWidth * 0.63, fontSize: 17, fontFamily: 'Typeka Mix', marginTop: 10, color: flavorColor }}>{flavorName}  </Text>
            {secondRow}
          </View>

          <TouchableOpacity style={{ marginRight: 15, alignSelf: 'center' }} onPress={onPress}>
            <Image source={favoriteImage} style={{ width: deviceWidth / 12, height: deviceWidth / 12, resizeMode: 'contain' }} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }

}
