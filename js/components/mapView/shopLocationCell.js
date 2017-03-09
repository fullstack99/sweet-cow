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
    let shop = this.props.shop.coordinatesObj.shop
    let distance = this.props.shop.distance
    if(distance === null){
      distance = ''
    }else{
      const words = distance.split(' ');
      distance = words[0] + " Miles"

    }


    let borderwidth = 6
    let deviceHeightDiff = deviceHeight/568.0
    if(deviceHeightDiff > 1){
      deviceHeightDiff += 0.25
    }
    let fulladdress =  shop.address + '+' + shop.location

    return(
      <View>
      <View style={{marginBottom: 10}}>
          <View style={{alignSelf:'center', borderWidth:borderwidth/2, borderColor:'rgba(63, 57, 19, 1)', width: deviceWidth * 0.9}}>
            <View style={{flexDirection:'column', justifyContent: 'center'}}>
            <Text style={{marginLeft:10, alignSelf:'flex-start', marginTop: 10*deviceHeightDiff, fontSize: 18, color: 'rgba(37, 0, 97, 1)', fontFamily:"Trade Gothic LT Std"}}> {shop.location.toUpperCase()} </Text>

              <View style={{marginTop: -deviceHeightDiff*2, flexDirection:'row'}}>
              <Text style={{flex: 1, marginLeft:10,  alignSelf:'center', fontSize: 16,  fontFamily: 'Typeka Mix', color: 'rgba(37, 0, 97, 1)'}}> {shop.address} </Text>
                <TouchableOpacity style={{flexDirection:'row', alignSelf:'flex-end', marginRight:10}} onPress={()=>this.props.onPress(fulladdress)}>
                <Image source={miles_icon} style={{alignSelf:'center', marginLeft: 20, marginRight: 10, width: deviceWidth/20, height: deviceHeight/20, resizeMode: 'contain'}}/>
                <Text style={{alignSelf:'center', fontSize: 16, textDecorationLine:'underline',  fontFamily: 'ProximaNova-Regular', color: 'rgba(37, 0, 97, 1)'}}>{distance}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity>
            <View style={{marginBottom:2, marginTop: 2*deviceHeightDiff,  backgroundColor: 'rgba(92,133,192,1)', height: deviceHeight*0.076, marginLeft:2, marginRight:2}}>
            <View style={{flexDirection:'row', justifyContent:'center'}}>
            <Image source={home_icon} style={{ marginLeft: 5, marginRight: 5, width: deviceWidth/15, height: deviceHeight/15, resizeMode: 'contain'}}/>
            <Text style={{ marginTop:deviceHeight*0.03 , fontSize: 12, fontFamily: 'ProximaNova-Regular', color: 'white'}}> Make this my home location </Text>
            </View>
            </View>
            </TouchableOpacity>
          </View>
      </View>
      </View>
    );
  }

}
