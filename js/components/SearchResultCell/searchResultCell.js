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

    let flavorName = toTitleCase(this.props.flavorName)
    let distanceFormatted = toTitleCase(distance+ ' away @' + shop.location)


    return(
<View style={{alignSelf:'center', borderWidth:borderwidth/2, borderColor:'rgba(63, 57, 19, 1)', width: deviceWidth * 0.85, marginTop:5}}>

  <View style={{marginRight:10, marginLeft:10, flexDirection:'row', marginBottom:5, justifyContent:'space-between'}}>

    <View style={{flexDirection:'column'}}>
      <Text style={{width:deviceWidth*0.65, fontSize: 17, fontFamily: 'Typeka Mix',marginTop:10 }}>{flavorName}  </Text>
      <TouchableOpacity style={{flexDirection:'row', justifyContent:'center'}} onPress={()=>this.props.onPress(fulladdress)}>
      <Image source={miles_icon} style={{width: deviceWidth/20, height: deviceWidth/20, resizeMode: 'contain'}}/>
      <Text style={{alignSelf:'center', width: deviceWidth*0.65, fontSize: 15, textDecorationLine:'underline',  fontFamily: 'ProximaNova-Regular', color: 'rgba(37, 0, 97, 1)'}}> {distanceFormatted}</Text>
      </TouchableOpacity>
    </View>

      <TouchableOpacity style={{marginRight:10,alignSelf:'center'}} onPress={onPress}>
      <Image source={favoriteImage} style={{width: deviceWidth/12, height: deviceWidth/12, resizeMode: 'contain'}}/>
      </TouchableOpacity>
  </View>
</View>
    );
  }

}
