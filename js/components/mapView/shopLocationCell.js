import React, { Component } from 'react';
import { Text, Dimensions, Image, TouchableOpacity } from 'react-native';
import { Container, Content, Button, View, ListItem } from 'native-base';


const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const miles_icon = require('../../../images/miles-away-icon.png');
const home_icon = require('../../../images/home-icon.png');


export default class ShopLocationCell extends Component{

  static propTypes = {
    shop: React.PropTypes.object
  }


homeLocationButton(){
    return(
    <View style={{marginBottom:2, marginTop: 2,  backgroundColor: 'rgba(92,133,192,1)', height: deviceHeight*0.076, marginLeft:2, marginRight:2, flexDirection:'row', justifyContent:'center'}}>
    <Image source={home_icon} style={{ marginLeft: 5, marginRight: 5, width: deviceWidth/15, height: deviceHeight/15, resizeMode: 'contain'}}/>
    <Text style={{ marginTop:deviceHeight*0.03 , fontSize: 15, fontFamily: 'ProximaNova-Regular', color: 'white'}}> This is my home location. </Text>
    </View>)
  }

makeHomeLocationButton(){
  return(<TouchableOpacity onPress={()=>this.props.setHomeLocation(this.props.shop.coordinatesObj.shop.id)}>
  <View style={{marginBottom:2, marginTop: 2,  backgroundColor: 'rgba(92,133,192,1)', height: deviceHeight*0.076, marginLeft:2, marginRight:2, flexDirection:'row', justifyContent:'center'}}>
  <Image source={home_icon} style={{ marginLeft: 5, marginRight: 5, width: deviceWidth/15, height: deviceHeight/15, resizeMode: 'contain'}}/>
  <Text style={{ marginTop:deviceHeight*0.03 , fontSize: 15, fontFamily: 'ProximaNova-Regular', color: 'white'}}> Make this my home location </Text>
  </View>
  </TouchableOpacity>)
}

  onLayoutCell(event){

    var {x, y, width, height} = event.nativeEvent.layout;
    console.warn(event.nativeEvent.layout)
    this.props.cellSizeCallback(this.props.index, event.nativeEvent.layout)
  }

  render(){
    let shop = this.props.shop.coordinatesObj.shop
    let distance = this.props.shop.distance
    let locationId = this.props.locationId
    if(distance === null){
      distance = ''
    }else{

      var res = distance.replace("mi", "Miles");
      res = res.replace("ft", "Feets");
      distance = res


    }


    let borderwidth = 6
    // let deviceHeightDiff = deviceHeight * 0.01
    // if(deviceHeightDiff > 1){
    //   deviceHeightDiff += 0.25
    // }
    let fulladdress = shop.address + '+' + shop.state + '+' + shop.zip_code

    let homeLocationButton = null

    if(locationId === shop.id){
      homeLocationButton = this.homeLocationButton()
    }else{
      homeLocationButton = this.makeHomeLocationButton()
    }


    return(
      <View onLayout={(event) => this.onLayoutCell(event)}>
      <TouchableOpacity style={{marginBottom: 10}} onPress={()=>this.props.openShopDetail(this.props.shop)}>
          <View style={{alignSelf:'center', borderWidth:borderwidth/2, borderColor:'rgba(63, 57, 19, 1)', width: deviceWidth * 0.9}}>
            <View style={{flexDirection:'column', justifyContent: 'center'}}>
            <Text style={{marginLeft:10, alignSelf:'flex-start', marginTop: 10, fontSize: 18, color: 'rgba(37, 0, 97, 1)', fontFamily:"Trade Gothic LT Std"}}>{shop.location.toUpperCase()} </Text>

              <View style={{marginTop: -2, flexDirection:'row'}}>
              <Text style={{flex: 1, marginLeft:10,  alignSelf:'center', fontSize: 16,  fontFamily: 'ProximaNova-Regular', color: 'rgba(37, 0, 97, 1)'}}>{shop.address} </Text>
                <TouchableOpacity style={{flexDirection:'row', alignSelf:'flex-end', marginRight:10}} onPress={()=>this.props.onPress(fulladdress)}>
                <Image source={miles_icon} style={{alignSelf:'center', marginLeft: 20, marginRight: 10, width: deviceWidth/20, height: deviceHeight/20, resizeMode: 'contain'}}/>
                <Text style={{alignSelf:'center', fontSize: 16, textDecorationLine:'underline',  fontFamily: 'ProximaNova-Regular', color: 'rgba(37, 0, 97, 1)'}}>{distance}</Text>
                </TouchableOpacity>
              </View>
            </View>
            {homeLocationButton}
          </View>
      </TouchableOpacity>
      </View>
    );
  }

}
