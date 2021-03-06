import React, { Component } from 'react';
import { Text, Dimensions, Image, TouchableOpacity } from 'react-native';
import { Container, Content, Button, View, ListItem } from 'native-base';
import { toTitleCase } from '../../utils/';


const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const miles_icon = require('../../../images/miles-away-icon.png');
const home_icon = require('../../../images/home-icon.png');
const cross_Icon = require('../../../images/Cross_Icon.png');
const favorited_Icon = require('../../../images/liked.png');



export default class MyFavoriteCell extends Component {

  static propTypes = {
    shop: React.PropTypes.object
  }

  getCrossButton() {
    return (
      <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => this.props.removeFavorite(this.props.keyVal)}>
        <Image source={cross_Icon} style={{ width: deviceWidth / 15, height: deviceWidth / 15, resizeMode: 'contain' }} />
      </TouchableOpacity>
    )
  }

  showHeart() {
    return (
      <Image source={favorited_Icon} style={{ alignSelf: 'center', width: deviceWidth / 12, height: deviceWidth / 12, resizeMode: 'contain' }} />
    )
  }

  getAvailableFlavours(fulladdress, distanceFormatted) {
    return (
      <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center' }} onPress={() => this.props.onPress(fulladdress)}>
        <Image source={miles_icon} style={{ marginTop: 3, width: deviceWidth / 22, height: deviceWidth / 22, resizeMode: 'contain' }} />
        <Text style={{ marginTop: 2, marginBottom: 10, alignSelf: 'center', width: deviceWidth * 0.63, fontSize: 15, textDecorationLine: 'underline', fontFamily: 'ProximaNova-Regular', color: 'rgba(37, 0, 97, 1)' }}>  {distanceFormatted}</Text>
      </TouchableOpacity>
    )
  }

  getUnavailableFlavors() {
    return (<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
      <Text style={{ marginTop: 2, marginBottom: 10, alignSelf: 'center', width: deviceWidth * 0.63, fontSize: 15, textDecorationLine: 'underline', fontFamily: 'ProximaNova-Regular', color: 'rgba(37, 0, 97, 1)' }}>  Flavor currently unavailable</Text>
    </View>)

  }


  render() {
    let shop = this.props.shop
    let distance = this.props.distance
    if (this.props.isAvailable === true) {
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

    let cancel = this.props.edit

    let crossButton = null
    if (cancel) {
      crossButton = this.getCrossButton()
    } else {
      crossButton = this.showHeart()
    }

    let flavorName = toTitleCase(this.props.flavorData.flavor)
    let flavorColor = '#' + ((this.props.flavorData.color.split('x'))[1])
    let distanceFormatted = toTitleCase(distance + ' @ ' + shop.location)

    let secondRow = null
    if (this.props.isAvailable === true) {
      secondRow = this.getAvailableFlavours(fulladdress, distanceFormatted)
    } else {
      secondRow = this.getUnavailableFlavors()
    }


    return (
      <TouchableOpacity style={{ alignSelf: 'center', borderWidth: borderwidth / 2, borderColor: 'rgba(63, 57, 19, 1)', width: deviceWidth * 0.95, marginTop: 5 }} onPress={() => this.props.openFlavorInfo(this.props.flavorData, this.props.shop)}>

        <View style={{ width: deviceWidth * 0.8, marginLeft: 10, flexDirection: 'row', marginBottom: 5, justifyContent: 'space-between' }}>

          <View style={{ flexDirection: 'column', marginLeft: 10 }}>
            <Text style={{ color: flavorColor, width: deviceWidth * 0.75, fontSize: 17, fontFamily: 'Typeka Mix', marginTop: 10 }}>{flavorName}</Text>
            {secondRow}
          </View>
          {crossButton}

        </View>
      </TouchableOpacity>
    );
  }

}
