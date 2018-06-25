
import React, { Component } from 'react';
import { Image, Dimensions, Alert, ActivityIndicator, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container, Content, Button, View, Text } from 'native-base';
import { setUser } from '../../actions/user';
import FirDatabase from "../../database/";
import Loading from '../base/loading/'
import { toTitleCase } from '../../utils/';



const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const info_Icon = require('../../../images/Info_Icon.png');
const cross_Icon = require('../../../images/Cross_Icon.png');
const user_icon = require('../../../images/user-icon.png');
const background = require('../../../images/background_ShopDetails.png');
const allergies_Icon = require('../../../images/Allergies_Icon.png');
const favorite_Icon = require('../../../images/like.png');
const favorite_Icon_white = require('../../../images/like_white.png');
const favorited_Icon = require('../../../images/liked.png');

let totalLikes = 0
let isFavorite = false
let showAllergens =  false

const {

    pushRoute,
} = actions;

class FlavorInfo extends Component {

  static propTypes = {
    navigation: React.PropTypes.shape({
      key: React.PropTypes.string,
      pushRoute: React.PropTypes.func,
    }),
  }


  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
    totalLikes = 0

    isFavorite = this.checkFavorite(this.props.flavorData.flavorData.flavor)

  }


  checkFavorite(flavorName, shopId){
    if(this.props.user)
    {let isFavorite = false


    let favorites = this.props.user.favorites

    favorites.map((favorite)=>{
      if(favorite.flavorName === flavorName){
        isFavorite = true
      }
    })
    return isFavorite
  }else{
    return false
  }


  }

  componentDidMount(){
    setTimeout(() => {
      this.getTotalLikesCount()
    }, 1000);

  }

  pushRoute(route){
    this.props.pushRoute({ key: route }, this.props.navigation.key);
  }

  popRoute() {
  this.props.popRoute(this.props.navigation.key);
  }

getTotalLikesCount(){
  let details = {flavorName:this.props.flavorData.flavorData.flavor, shopId:this.props.flavorData.shopId}
  FirDatabase.getFavoritesCount(details, (data) => {
  totalLikes = data.count

  // if(isFavorite == true && totalLikes == 0){
  //   this.getTotalLikesCount()
  // }
  // else{
    this.setState({isLoading: false})
  // }

  })
}

setFavoritesAction(){
   if(this.props.user){
    this.props.setFavoritesAction(this.props.flavorData.flavorData,isFavorite)
    if(isFavorite === true){
      isFavorite = false
      totalLikes -= 1
      if(totalLikes < 0){
        totalLikes = 0
      }

    }else{
      isFavorite = true
      totalLikes += 1

    }
    this.forceUpdate()
  }else{
    this.loginConfimation()
  }


}

loginConfimation(){
  Alert.alert(
'Confirm',
'This action requires login, do you want to login or create an account?',
[
{text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
{text: 'Yes', onPress: () => this.goToLogin()},
],
{ cancelable: false }
)
}


goToLogin(){
  ()=>this.props.crossAction
  this.props.pushRoute({ key: 'home'}, this.props.navigation.key);
}

  setFavoriteButton(){

    let onPress = ()=>this.setFavoritesAction()
    let favoriteImage = favorite_Icon_white
    let buttonText = 'ADD TO MY FAVORITES'
      if(isFavorite === true){

      favoriteImage = favorited_Icon
      buttonText = 'REMOVE FROM MY FAVORITES'
      }

    return(
      <TouchableOpacity style={{width:deviceWidth*0.8, marginBottom:10,  backgroundColor: 'rgba(36,124,187,1)', height: deviceHeight*0.076, flexDirection:'row', alignSelf:'center'}} onPress={onPress}>
          <Image source={favoriteImage} style={{alignSelf:'center', marginLeft: 20, marginRight: 5, width: deviceWidth/15, height: deviceHeight/15, resizeMode: 'contain'}}/>
          <Text style={{ width:deviceWidth*0.6, alignSelf:'center', textAlign:'center', fontSize: 15, fontFamily:'ProximaNova-Semibold', color: 'white'}}>{buttonText}</Text>
      </TouchableOpacity>
    )
  }

  showHideAllergens(){
    if(showAllergens === true){
        showAllergens = false
    }else{
        showAllergens = true
    }
    this.forceUpdate()

  }


render() {
isFavorite = this.checkFavorite(this.props.flavorData.flavorData.flavor)
let borderwidth = 6
let setFavoriteButton = this.setFavoriteButton()
let flavorColor = '#'+((this.props.flavorData.flavorData.color.split('x'))[1])

let imageUrl = background
if(this.props.flavorData.flavorData.imageUrl && this.props.flavorData.flavorData.imageUrl !== null && this.props.flavorData.flavorData.imageUrl !== ''){
  if (this.props.flavorData.flavorData.imageUrl.includes('&')) {
    var updatedURL = this.props.flavorData.flavorData.imageUrl.split('&');
    var firstPart = updatedURL[0]
    var secondPart = updatedURL[1]
    imageUrl = {uri : firstPart+secondPart}

    console.warn(imageUrl, "imageUrl")

  }else{
    imageUrl = {uri : this.props.flavorData.flavorData.imageUrl}
  }
  
}

let allergensText = ''
let colon = ''
if(showAllergens === true){
    colon = ':'
    if(this.props.flavorData.flavorData.allergens && this.props.flavorData.flavorData.allergens != null){
      allergensText = this.props.flavorData.flavorData.allergens
    }
   
}

var descriptionString = ''

if(this.props.flavorData.flavorData.description && this.props.flavorData.flavorData.description !== null && this.props.flavorData.flavorData.description !== "")
{
  descriptionString = this.props.flavorData.flavorData.description
  if(descriptionString[descriptionString.length-1] == "." || descriptionString[descriptionString.length-1] == " "){
    descriptionString = descriptionString.substring(0, descriptionString.length-1);
    
  
  }
  descriptionString = descriptionString+'.'
  
}


console.warn(this.props.flavorData);
    return (
<Container>

  <View style={{width: deviceWidth*0.9, height: deviceHeight * 0.9, borderWidth:borderwidth, borderColor:'rgba(29, 16, 96, 1)', alignSelf:'center', marginTop:deviceHeight*0.05 }}>
  <View style={{backgroundColor:'rgba(243,243,243,1)', width: deviceWidth*0.9 - (2 * borderwidth), height: deviceHeight * 0.12, alignSelf:'center', flexDirection:'row', justifyContent:'space-between'}}>
    <View style={{height: deviceHeight * 0.14, alignSelf:'center', flexDirection:'row'}}>
      <Text style={{color:flavorColor, width:deviceWidth*0.7, marginLeft:20, alignSelf:'center', fontSize:22,fontFamily:'ProximaNova-Semibold'}}>{toTitleCase(this.props.flavorData.flavorData.flavor)}</Text>
    </View>
    <TouchableOpacity style={{marginRight: 20, alignSelf:'center'}} onPress={this.props.crossAction}>
      <Image source={cross_Icon} style={{ width: deviceWidth/15, height: deviceWidth/15, resizeMode: 'contain'}}/>
    </TouchableOpacity>
  </View>

  <View style={{backgroundColor:'rgba(29, 16, 96, 1)', width: deviceWidth*0.9, height:borderwidth, alignSelf:'center'}}>
  </View>
  <Content style={{backgroundColor:'rgba(243,243,243,1)'}}>

    <Image source={imageUrl} style={{flex: 1, width: (deviceWidth * 0.9)-(2*borderwidth), height: (deviceWidth * 0.9)-(2*borderwidth), resizeMode: 'contain'}}>
    <View style={{height: deviceHeight * 0.10, flexDirection:'row'}}>
      <Image source={favorite_Icon} style={{marginLeft: 20, alignSelf:'center', width: deviceWidth/12, height: deviceHeight/12, resizeMode: 'contain'}}/>
      <Text style={{fontFamily:'ProximaNova-Semibold', marginLeft:10, alignSelf:'center',fontSize:25, color:'rgba(62, 57, 21, 1)', backgroundColor:'rgba(62, 57, 21, 0)'}}>{totalLikes}</Text>
    </View>
    </Image>

    <View style={{backgroundColor:'rgba(29, 16, 96, 1)', width: deviceWidth*0.9, height:borderwidth, alignSelf:'center'}}>
    </View>

    <View style={{backgroundColor:'rgba(243,243,243,1)', width: deviceWidth*0.9 - (2* borderwidth), alignSelf:'center', flexDirection:'column', justifyContent:'space-between'}}>
      <View style={{marginTop:20, marginBottom:10, marginLeft:15, marginRight: 15, alignSelf:'flex-start'}}>
      <Text style={{textAlign:'left', fontSize:15, color:'rgba(29, 16, 96, 1)'}}>{descriptionString}</Text>
      </View>
      {setFavoriteButton}
      <View style={{width:deviceWidth*0.5, marginBottom: 15, flexDirection:'row'}}>
        <Image source={allergies_Icon} style={{marginLeft: 15, alignSelf:'center', width: deviceWidth/17, height: deviceWidth/17, resizeMode: 'contain'}}/>
        <TouchableOpacity style={{marginLeft:5, alignSelf:'center'}} onPress={()=>this.showHideAllergens()}>
        <Text style={{fontSize:16, fontFamily:'ProximaNova-Regular', color:'rgba(11, 126, 192, 1)'}}>Allergens</Text>
        </TouchableOpacity>
        <Text style={{marginTop:2, fontSize:16, fontFamily:'ProximaNova-Regular', color:'rgba(11, 126, 192, 1)'}}>{colon}</Text>
        <Text style={{marginLeft:5, alignSelf:'center', fontSize:13, color:'rgba(11, 126, 192, 1)', fontFamily:'ProximaNova-Regular'}}>{allergensText}</Text>
      </View>


    </View>
    </Content>

  </View>
  <Loading isLoading={this.state.isLoading}/>
</Container>
    );
  }
}


function bindActions(dispatch) {
  return {
    pushRoute: (route, key) => dispatch(pushRoute(route, key)),
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
  user: state.user.name,
});

export default connect(mapStateToProps, bindActions)(FlavorInfo);
