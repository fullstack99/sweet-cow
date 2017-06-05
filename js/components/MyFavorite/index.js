
import React, { Component } from 'react';
import { Image, Dimensions, Alert, ActivityIndicator, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container, Content, Button, View, Text } from 'native-base';
import { setUser } from '../../actions/user';
import HyperlinkButton from '../base/hyperlinkButton/'
import MyFavoriteCell from "./myFavoriteCell";
import SearchResults from "../SearchScreen/SearchResults"
import { openExternalMaps } from '../../utils/';

import FirDatabase from "../../database/";
import FlavourInfoView from '../ShopDetails/FlavourDetail'


const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const logoCow = require('../../../images/logo_cow_horizontal.png');
const map_icon = require('../../../images/map-locator.png');
const search_icon = require('../../../images/search-icon.png');
const favorite_icon = require('../../../images/favorite-icon.png');
const user_icon = require('../../../images/user-icon.png');


let flavorDetail = null

const {
  replaceAt,
    popRoute,
    pushRoute,
} = actions;

class MyFavorite extends Component {


  static propTypes = {
    navigation: React.PropTypes.shape({
      key: React.PropTypes.string,
      replaceAt: React.PropTypes.func,
      pushRoute: React.PropTypes.func,
      popRoute: React.PropTypes.func,
    }),
  }

  constructor(props) {
    super(props);
    this.state = {
      isEditMode: false,
      isSearchMode: false,
      isInfoMode: false
    };
  }

  flavorInfoDismiss(){
    this.setState({isInfoMode: false})
  }


  componentDidMount() {

  }

  openFlavorInfo(flavorData, shop){

    let flavorElement = {flavorData:flavorData, isFavorite:true, shopId:shop.id}
    flavorDetail = flavorElement
    this.setState({isInfoMode: true})
  }

  addFavorites(details){
    try{



      let key = FirDatabase.setFavorites(this.props.user.uid, details)
      let detailVal = {key:key, flavorName:details.flavorName, shopId:details.shopId}

      FirDatabase.getFavoritesCount(details, (data) => {
      console.warn(data.count);
      let value = data.count+1
      FirDatabase.setFavoritesCount(details, value)
      })

      let user = this.props.user
      user.favorites.push(detailVal)
      this.setUser(user)
      this.forceUpdate()
    }
    catch(error){

      this.setState({isLoading: false})
      Alert.alert(
        'Error',
        `${error.toString()}`,
      )
    }
  }

  setFavoritesFromDetails(flavorData, isFavorite){
    console.warn(isFavorite);
    let shopId = flavorDetail.shopId;
    let favId = this.getFavoriteKey(flavorData.flavor, shopId)
    console.warn(favId)
    let element = {flavorName:flavorData.flavor, shopId:shopId, isFavorite:isFavorite, key:favId}
    this.changeFavouriteState(element)
  }

  getFavoriteKey(flavorName, shopId){
    let favKey = ""
    let favorites = this.props.user.favorites

    favorites.map((favorite)=>{
      if(favorite.flavorName === flavorName){
        favKey = favorite.key
      }
    })
    return favKey
  }

  changeFavouriteState(details){
    if(details.isFavorite === false){
      console.warn("add to fav")
      this.addFavorites(details)
    }
    else{
      console.warn("remove from fav")
      this.removeFavorites(details)
    }
  }

  pushRoute(route){
    this.props.pushRoute({ key: route }, this.props.navigation.key);
  }

  popRoute() {
  this.props.popRoute(this.props.navigation.key);
  }

  openMyProfile (){
    let routes = this.props.navigation.routes
    let tempRoute = []
    routes.map((route)=>{
      if(route.key === "mapView"){
        tempRoute.push(route)
      }
    })

    var isContainMyProfile = false

    routes.map((route)=>{
      if(route.key === "myProfile"){
        tempRoute.push(route)
        isContainMyProfile = true
      }
    })


    if(isContainMyProfile === true){
      tempRoute.push(routes[routes.length - 1])
      routes = []
      routes = tempRoute
      this.props.navigation.routes = routes
      this.popRoute()
    }
    else{
    this.props.pushRoute({ key: 'myProfile'}, this.props.navigation.key);
  }
  }

  mapButtonClicked (){
    let routes = this.props.navigation.routes

    let tempRoute = []
    routes.map((route)=>{
      if(route.key === "mapView"){
        tempRoute.push(route)
      }
    })

    tempRoute.push(routes[routes.length - 1])
    routes = []
    routes = tempRoute
    this.props.navigation.routes = routes
    this.popRoute()
  }

  editButtonPressed(){
    if(this.state.isEditMode == true){
      this.setState({isEditMode: false})
    }else{
      this.setState({isEditMode: true})
    }
  }

  onSearchButtonClicked() {
    if(this.state.isSearchMode == true){
      this.setState({isSearchMode: false})
    }else{
      this.setState({isSearchMode: true})
    }
  }

  openExternalMaps(location){
    openExternalMaps(location,this.props.lastPosition)
  }


  searchDismiss() {
    this.setState({isSearchMode: false})
  }

  removeFavorite(key){
      this.props.user.favorites.map((favorite)=>{
        if(key === favorite.key){
            Alert.alert(
    'Remove from favorites',
    'Are you sure you want to remove this flavor from your favorites?',
    [
      {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
      {text: 'Yes', onPress: () => this.setFavorites(favorite)},
    ],
    { cancelable: false }
  )
        }
      })
  }

  removeFavorites(details){
    try{
      FirDatabase.removeFavorites(this.props.user.uid, details)
      FirDatabase.getFavoritesCount(details, (data) => {
      console.warn(data.count);

      let value = data.count-1
      if(value < 0){
        value = 0
      }
      FirDatabase.setFavoritesCount(details, value)
      })

      let user = this.props.user
// removing from users

let tempUSerArray = []
user.favorites.map((fav)=>{
  if(fav.key !== details.key){
    tempUSerArray.push(fav)
  }
})
      user.favorites = tempUSerArray
      this.setUser(user)
      this.forceUpdate()
    }
    catch(error){

      this.setState({isLoading: false})
      Alert.alert(
        'Error',
        `${error.toString()}`,
      )
    }
  }



  logoClicked(){
    this.mapButtonClicked()
  }

  setFavorites(details){
    try{
      FirDatabase.removeFavorites(this.props.user.uid, details)
      FirDatabase.getFavoritesCount(details, (data) => {
      console.warn(data.count);

      let value = data.count-1
      if(value < 0){
        value = 0
      }
      FirDatabase.setFavoritesCount(details, value)
      })

      let user = this.props.user
// removing from users

let tempUSerArray = []
user.favorites.map((fav)=>{
  if(fav.key !== details.key){
    tempUSerArray.push(fav)
  }
})
      user.favorites = tempUSerArray
      this.setUser(user)
      this.forceUpdate()
    }
    catch(error){

      this.setState({isLoading: false})
      Alert.alert(
        'Error',
        `${error.toString()}`,
      )
    }
  }

  setUser(user) {
    this.props.setUser(user);
  }


  render() {

let borderwidth = 6

let editButtonTitle = 'Edit'
if(this.state.isEditMode){
  editButtonTitle = 'Cancel'
}


let favoriteCell = []
let favoriteArray = []

let unAvailableFavorites = []

this.props.user.favorites.map((favorite)=>{
  let isEntered = false
    this.props.distanceArray.map((shop)=>{
      if(shop.coordinatesObj.shop !== null){
          if(shop.coordinatesObj.shop != undefined){
              shop.coordinatesObj.shop.flavors.map((flavor)=>{
                if(favorite.flavorName === flavor.flavor){
                  let element = {keyVal:favorite.key, shop: shop.coordinatesObj.shop, distance:shop.distance, flavorData:flavor, isAvailable:true}
                  favoriteArray.push(element)
                  isEntered = true
                }
              })
          }
      }
    })
    if(isEntered === false){
      unAvailableFavorites.push(favorite)
    }
})

unAvailableFavorites.map((favorite)=>{
  let isEntered = false
    this.props.distanceArray.map((shop)=>{
      if(shop.coordinatesObj.shop !== null){
          if(shop.coordinatesObj.shop != undefined){
              shop.coordinatesObj.shop.flavors.map((flavor)=>{
                if(isEntered === false && (favorite.flavorName === flavor.flavor) ){
                  let element = {keyVal:favorite.key, shop: shop.coordinatesObj.shop, distance:shop.distance, flavorData:flavor, isAvailable:true}
                  favoriteArray.push(element)
                  isEntered = true
                }
              })
          }
      }
    })
    if(isEntered === true){
      unAvailableFavorites.pop(favorite)
    }
})



  unAvailableFavorites.map((favorite)=>{
  this.props.searchData.map((searchObj)=>{
        if(searchObj != undefined){
            searchObj.flavors.map((flavor)=>{
              if(favorite.flavorName === flavor.flavor){
                let element = {keyVal:favorite.key, shop: searchObj, distance:0, flavorData:flavor, isAvailable:false}
                favoriteArray.push(element)
              }
            })
        }
  })
  })


  favoriteArray.sort((obj1, obj2) => {
    if (obj1.distance > obj2.distance) return 1;
    if (obj1.distance < obj2.distance) return -1;
    return 0;
  })


favoriteArray.map((favorite)=>{
    favoriteCell.push(<MyFavoriteCell  keyVal={favorite.keyVal}  shop={favorite.shop} distance={favorite.distance} flavorData={favorite.flavorData} edit={this.state.isEditMode} isAvailable={favorite.isAvailable} onPress={(location)=>this.openExternalMaps(location)} removeFavorite={(key)=>this.removeFavorite(key)} openFlavorInfo={(flavorData, shop) => this.openFlavorInfo(flavorData, shop)}/>)
})



    return (
      <Container>

      <View style={{width: deviceWidth, height: deviceHeight * 0.14, flexDirection:'row'}}>
        <TouchableOpacity onPress={()=>this.logoClicked()}>
          <Image source={logoCow} style={{marginLeft: 10, width: deviceWidth/2.2, height: deviceHeight/6.2, alignSelf:'flex-start', marginTop: 0, resizeMode: 'contain'}}/>
        </TouchableOpacity>
          <TouchableOpacity onPress={()=>this.mapButtonClicked()}>
              <Image source={map_icon} style={{marginLeft: 25, marginTop: 25, width: deviceWidth/12, height: deviceHeight/12, resizeMode: 'contain'}}/>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=>this.onSearchButtonClicked()}>
              <Image source={search_icon} style={{marginLeft: 8, marginTop: 25, width: deviceWidth/12, height: deviceHeight/12, resizeMode: 'contain'}}/>
          </TouchableOpacity>

          <TouchableOpacity>
              <Image source={favorite_icon} style={{marginLeft: 8, marginTop: 25, width: deviceWidth/12, height: deviceHeight/12, resizeMode: 'contain'}}/>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=>this.openMyProfile()}>
              <Image source={user_icon} style={{marginLeft: 8, marginTop: 25, width: deviceWidth/12, height: deviceHeight/12, resizeMode: 'contain'}}/>
          </TouchableOpacity>
      </View>

      <View style={{marginLeft:borderwidth/2, marginTop:-borderwidth, backgroundColor:'rgba(29, 16, 96, 1)', width: deviceWidth, height:borderwidth}}>
      </View>
      <View style={{width: deviceWidth, flexDirection:'row'}}>
          <Text style={{marginLeft:deviceWidth*0.18, width: deviceWidth*0.62, textAlign:'center', marginTop: 20, fontSize: 30, color: 'rgba(29, 16, 96, 1)', fontFamily:"Trade Gothic LT Std"}}>MY FAVORITES</Text>
          <View style={{width: deviceWidth * 0.2,  justifyContent:'flex-end',alignSelf:'center'}}>
          <HyperlinkButton width={deviceWidth * 0.15} text={editButtonTitle} textColor="#422575" fontSize={20} onPress={()=>this.editButtonPressed()}/>
          </View>
      </View>

      <ScrollView>
      {favoriteCell}
      </ScrollView>

      <SearchResults isSearchMode={this.state.isSearchMode} distanceArray={this.props.distanceArray} lastPosition={this.props.lastPosition}
       crossAction={()=>this.searchDismiss()}
      />


      <FlavourInfoView isInfoMode={this.state.isInfoMode} flavorData={flavorDetail}
        crossAction={()=>this.flavorInfoDismiss()} setFavoritesAction={(flavorData, isFavorite)=>this.setFavoritesFromDetails(flavorData, isFavorite)}
      />

      </Container>
    );
  }
}

function bindActions(dispatch) {
  return {
    replaceAt: (routeKey, route, key) => dispatch(replaceAt(routeKey, route, key)),
    setUser: name => dispatch(setUser(name)),
    popRoute: (key) => dispatch(popRoute(key)),
    pushRoute: (route, key) => dispatch(pushRoute(route, key)),
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
  user: state.user.name,
  lastPosition: state.lastPosition.name,
  distanceArray: state.shopData.name,
  searchData: state.searchData.name
});

export default connect(mapStateToProps, bindActions)(MyFavorite);
