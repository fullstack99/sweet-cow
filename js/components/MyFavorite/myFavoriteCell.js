import React, { Component } from 'react';
import { Text, Dimensions, Image, TouchableOpacity } from 'react-native';
import { Container, Content, Button, View, ListItem } from 'native-base';


const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const miles_icon = require('../../../images/miles-away-icon.png');
const home_icon = require('../../../images/home-icon.png');
const favorited_Icon = require('../../../images/Favorited_Icon.png');
const cross_Icon = require('../../../images/Cross_Icon.png');


export default class MyFavoriteCell extends Component{

  static propTypes = {
    shop: React.PropTypes.object
  }

  getCrossButton(){
    return(
      <TouchableOpacity style={{ alignSelf:'center'}} onPress={()=>this.props.removeFavorite(this.props.keyVal)}>
        <Image source={cross_Icon} style={{ width: deviceWidth/12, height: deviceHeight/12, resizeMode: 'contain'}}/>
      </TouchableOpacity>
    )
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

    let cancel = this.props.edit

    let crossButton = null
    if(cancel){
      crossButton = this.getCrossButton()
    }



    return(
    <View style={{alignSelf:'center', borderWidth:borderwidth/2, borderColor:'rgba(63, 57, 19, 1)', width: deviceWidth * 0.95, marginTop:5}}>

    <View style={{width: deviceWidth*0.75,marginLeft:10, flexDirection:'row', marginBottom:5, justifyContent:'space-between'}}>

    <Image source={favorited_Icon} style={{alignSelf:'center', width: deviceWidth/10, height: deviceHeight/10, resizeMode: 'contain'}}/>

    <View style={{flexDirection:'column', marginLeft:15}}>
      <Text style={{width:deviceWidth*0.55, fontSize: 20, fontFamily: 'Typeka Mix',marginTop:10 }}>{this.props.flavorName}</Text>
      <TouchableOpacity style={{flexDirection:'row'}} onPress={()=>this.props.onPress(fulladdress)}>
      <Image source={miles_icon} style={{marginRight: 10, width: deviceWidth/20, height: deviceHeight/20, resizeMode: 'contain'}}/>
      <Text style={{alignSelf:'center',width: deviceWidth*0.55, fontSize: 16, textDecorationLine:'underline',  fontFamily: 'ProximaNova-Regular', color: 'rgba(37, 0, 97, 1)'}}>{distance} away @ {shop.location}</Text>
      </TouchableOpacity>
      </View>
      {crossButton}

      </View>
        </View>
    );
  }

}
