import React, { Component } from 'react';
import { Text, Dimensions, Image, TouchableOpacity } from 'react-native';
import { Container, Content, Button, View, ListItem } from 'native-base';


const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const miles_icon = require('../../../images/miles-away-icon.png');
const home_icon = require('../../../images/home-icon.png');


export default class ShopLocationCell extends Component{
  // const { location, city, state, zip_code, phone, address } = shop;
  static propTypes = {
    shop: React.PropTypes.object
  }



  render(){
    let borderwidth = 6
    let deviceHeightDiff = deviceHeight/568.0
    if(deviceHeightDiff > 1){
      deviceHeightDiff += 0.25
    }

    return(
      <View style={{marginBottom: 10}}>
          <View style={{alignSelf:'center', borderWidth:borderwidth/2, borderColor:'rgba(63, 57, 19, 1)', width: deviceWidth * 0.9, height: deviceHeight*0.2}}>
            <View style={{flexDirection:'column', justifyContent: 'center'}}>
            <Text style={{marginLeft:10, alignSelf:'flex-start', marginTop: 10*deviceHeightDiff, fontSize: 17, color: 'rgba(37, 0, 97, 1)', fontFamily:"Trade Gothic LT Std"}}> {this.props.shop.location.toUpperCase()} </Text>

              <View style={{marginTop: 2*deviceHeightDiff, flexDirection:'row'}}>
              <Text style={{flex: 1, marginLeft:10,  alignSelf:'center', fontSize: 16, fontFamily: 'ProximaNova-Regular', color: 'rgba(37, 0, 97, 1)'}}> {this.props.shop.address} </Text>
                <View style={{flexDirection:'row', alignSelf:'flex-end'}}>
                <Image source={miles_icon} style={{alignSelf:'center', marginLeft: 20, marginRight: 10, width: deviceWidth/20, height: deviceHeight/20, resizeMode: 'contain'}}/>
                <Text style={{alignSelf:'center', fontSize: 16, textDecorationLine:'underline', fontFamily: 'ProximaNova-Regular', color: 'rgba(37, 0, 97, 1)'}}> 0.5 miles </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity>
            <View style={{marginTop: 2*deviceHeightDiff, alignSelf:'center', backgroundColor: 'rgba(92,133,192,1)', width: deviceWidth * 0.87, height: deviceHeight*0.076}}>
            <View style={{flexDirection:'row', justifyContent:'center'}}>
            <Image source={home_icon} style={{alignSelf:'center', marginLeft: 5, marginRight: 5, width: deviceWidth/15, height: deviceHeight/15, resizeMode: 'contain'}}/>
            <Text style={{alignSelf:'center', fontSize: 12, fontFamily: 'ProximaNova-Regular', color: 'white'}}> Make this my home location </Text>
            </View>
            </View>
            </TouchableOpacity>
          </View>

      </View>
    );
  }

}
