
import React, { Component } from 'react';
import { Image, Dimensions, Alert, ActivityIndicator, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container, Content, Button, View, Text } from 'native-base';
import { setUser } from '../../actions/user';
import FirDatabase from "../../database/";
import Loading from '../base/loading/'



const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const info_Icon = require('../../../images/Info_Icon.png');
const cross_Icon = require('../../../images/Cross_Icon.png');
const user_icon = require('../../../images/user-icon.png');
const background = require('../../../images/background_ShopDetails.png');
const allergies_Icon = require('../../../images/Allergies_Icon.png');
const favorite_Icon = require('../../../images/Favorite_Icon.png');
const favorited_Icon = require('../../../images/Favorited_Icon.png');

let totalLikes = 0
let isFavorite = false

export default class FlavorInfo extends Component {


  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
    totalLikes = 0
    isFavorite = this.props.flavorData.isFavorite
    this.getTotalLikesCount()
  }


  pushRoute(route){
    this.props.pushRoute({ key: route }, this.props.navigation.key);
  }

  popRoute() {
  this.props.popRoute(this.props.navigation.key);
  }

getTotalLikesCount(){
  let details = {flavorName:this.props.flavorData.flavorName, shopId:this.props.flavorData.shopId}
  FirDatabase.getFavoritesCount(details, (data) => {
  totalLikes = data.count
  this.setState({isLoading: false})

  })
}

setFavoritesAction(){
  this.props.setFavoritesAction(this.props.flavorData.flavorName)
  isFavorite = true
  totalLikes += 1
  this.forceUpdate()
}

  setFavoriteButton(){

    let onPress = ()=>this.setFavoritesAction()
    let favoriteImage = favorite_Icon
      if(isFavorite === true){
      onPress = null
      favoriteImage = favorited_Icon
      }

    return(
      <TouchableOpacity style={{width:deviceWidth*0.8, marginBottom:10,  backgroundColor: 'rgba(36,124,187,1)', height: deviceHeight*0.076, flexDirection:'row', alignSelf:'center'}} onPress={onPress}>
          <Image source={favoriteImage} style={{alignSelf:'center', marginLeft: 20, marginRight: 5, width: deviceWidth/15, height: deviceHeight/15, resizeMode: 'contain'}}/>
          <Text style={{ width:deviceWidth*0.6, alignSelf:'center', textAlign:'center', fontSize: 15, fontFamily:'Typeka Mix', color: 'white'}}>ADD TO MY FAVORITE</Text>
      </TouchableOpacity>
    )
  }


render() {

let borderwidth = 6
let setFavoriteButton = this.setFavoriteButton()
    return (
<Container>

  <View style={{width: deviceWidth*0.9, height: deviceHeight * 0.9, borderWidth:borderwidth, borderColor:'rgba(29, 16, 96, 1)', alignSelf:'center', marginTop:deviceHeight*0.05 }}>
    <View style={{backgroundColor:'rgba(243,243,243,1)', width: deviceWidth*0.9 - (2 * borderwidth), height: deviceHeight * 0.14, alignSelf:'center', flexDirection:'row', justifyContent:'space-between'}}>
      <View style={{height: deviceHeight * 0.14, alignSelf:'center', flexDirection:'row'}}>
        <Image source={info_Icon} style={{marginLeft: 20, alignSelf:'center', width: deviceWidth/12, height: deviceHeight/12, resizeMode: 'contain'}}/>
        <Text style={{color:this.props.flavorData.flavorColor, width:deviceWidth*0.55, marginLeft:10, alignSelf:'center', fontSize:18,fontFamily:'Typeka Mix'}}>{this.props.flavorData.flavorName}</Text>
      </View>
      <TouchableOpacity style={{marginRight: 20, alignSelf:'center'}} onPress={this.props.crossAction}>
        <Image source={cross_Icon} style={{ width: deviceWidth/12, height: deviceHeight/12, resizeMode: 'contain'}}/>
      </TouchableOpacity>
    </View>
    <View style={{backgroundColor:'rgba(29, 16, 96, 1)', width: deviceWidth*0.9, height:borderwidth, alignSelf:'center'}}>
    </View>

    <Image source={background} style={{flex: 1, width: (deviceWidth * 0.9)-(2*borderwidth), height: deviceHeight*0.5, resizeMode: 'stretch'}}>
    <View style={{height: deviceHeight * 0.10, flexDirection:'row'}}>
      <Image source={user_icon} style={{marginLeft: 20, alignSelf:'center', width: deviceWidth/12, height: deviceHeight/12, resizeMode: 'contain'}}/>
      <Text style={{marginLeft:10, alignSelf:'center',fontSize:20}}>{totalLikes}</Text>
    </View>

      <View style={{marginLeft:20, width: deviceWidth*0.7, height: deviceHeight * 0.35, borderWidth:borderwidth, borderColor:'rgba(29, 16, 96, 1)', backgroundColor:'rgba(243,243,243,0.5)' }}>
      <Text style={{alignSelf:'center',fontSize:20}}>Ethical master cleanse subway tile activated charcoal air plat, cold-pressed kitsch typewriter</Text>
      </View>

    </Image>
    <View style={{backgroundColor:'rgba(29, 16, 96, 1)', width: deviceWidth*0.9, height:borderwidth, alignSelf:'center'}}>
    </View>
    <View style={{backgroundColor:'rgba(243,243,243,1)', width: deviceWidth*0.9 - (2* borderwidth), height: deviceHeight * 0.20, alignSelf:'center', flexDirection:'column', justifyContent:'space-between'}}>
      <View style={{width:deviceWidth*0.4, height: deviceHeight * 0.1, flexDirection:'row'}}>
        <Image source={allergies_Icon} style={{marginLeft: 20, alignSelf:'center', width: deviceWidth/12, height: deviceHeight/12, resizeMode: 'contain'}}/>
        <Text style={{marginLeft:10, alignSelf:'center',fontFamily:'Typeka Mix'}}>ALLERGENS:</Text>
        <Text style={{marginLeft:10, alignSelf:'center'}}>Corn, Dairy, Soy, Nuts (Peanuts)</Text>
      </View>

      {setFavoriteButton}
    </View>
  </View>
  <Loading isLoading={this.state.isLoading}/>
</Container>
    );
  }
}
