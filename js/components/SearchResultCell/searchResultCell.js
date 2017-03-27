import React, { Component } from 'react';
import { Text, Dimensions, Image, TouchableOpacity } from 'react-native';
import { Container, Content, Button, View, ListItem } from 'native-base';


const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const miles_icon = require('../../../images/miles-away-icon.png');
const home_icon = require('../../../images/home-icon.png');
const favorite_Icon = require('../../../images/Favorite_Icon.png');
const favorited_Icon = require('../../../images/Favorited_Icon.png');


export default class SearchResultCell extends Component{

  static propTypes = {
    shop: React.PropTypes.object
  }




  render(){
    let shop = this.props.shop
    let distance = this.props.distance
    if(distance === null){
      distance = ''
    }else{
      const words = distance.split(' ');
      distance = words[0] + " Miles"

    }

let borderwidth = 6

  let fulladdress = shop.address + '+' + shop.location + ',+' + shop.state + '+' + shop.zip_code

    let element = {flavorName:this.props.flavorName, shopId:shop.id}

    let onPress = ()=>this.props.setFavorites(element)
    let favoriteImage = favorite_Icon
    if(this.props.isFavorite === true){
    onPress = null
    favoriteImage = favorited_Icon
    }


    return(
      <View style={{alignSelf:'center', borderWidth:borderwidth/2, borderColor:'rgba(63, 57, 19, 1)', width: deviceWidth * 0.85, marginTop:5}}>

      <View style={{width: deviceWidth*0.75,marginLeft:10, flexDirection:'row', marginBottom:5, justifyContent:'space-between'}}>

    <View style={{flexDirection:'column'}}>
      <Text style={{width:deviceWidth*0.6, fontSize: 20, fontFamily: 'Typeka Mix',marginTop:10 }}>{this.props.flavorName}  </Text>
      <TouchableOpacity style={{flexDirection:'row'}} onPress={()=>this.props.onPress(fulladdress)}>
      <Image source={miles_icon} style={{marginRight: 10, width: deviceWidth/20, height: deviceHeight/20, resizeMode: 'contain'}}/>
      <Text style={{width: deviceWidth*0.6, fontSize: 16, textDecorationLine:'underline',  fontFamily: 'ProximaNova-Regular', color: 'rgba(37, 0, 97, 1)'}}> {distance} away @ {shop.location}</Text>
      </TouchableOpacity>
      </View>

      <TouchableOpacity style={{alignSelf:'center'}} onPress={onPress}>
      <Image source={favoriteImage} style={{width: deviceWidth/10, height: deviceHeight/10, resizeMode: 'contain'}}/>
      </TouchableOpacity>
      </View>
        </View>
    );
  }

}
