
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


const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const logoCow = require('../../../images/logo_cow_horizontal.png');
const map_icon = require('../../../images/map-locator.png');
const search_icon = require('../../../images/search-icon.png');
const favorite_icon = require('../../../images/favorite-icon.png');
const user_icon = require('../../../images/user-icon.png');




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
      isSearchMode: false
    };
  }

  componentDidMount() {

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
          this.setFavorites(favorite)
        }
      })
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

this.props.user.favorites.map((favorite)=>{
    this.props.distanceArray.map((shop)=>{
      if(shop.coordinatesObj.shop !== null){
          if(shop.coordinatesObj.shop != undefined){
              shop.coordinatesObj.shop.flavors.map((flavor)=>{
                if(favorite.shopId === shop.coordinatesObj.shop.id && favorite.flavorName === flavor){
                  let element = {keyVal:favorite.key, shop: shop.coordinatesObj.shop, distance:shop.distance, flavorName:favorite.flavorName}
                  favoriteArray.push(element)
                }
              })
          }
      }
    })
})

favoriteArray.sort((obj1, obj2) => {
  if (obj1.distance > obj2.distance) return 1;
  if (obj1.distance < obj2.distance) return -1;
  return 0;
})

favoriteArray.map((favorite)=>{
    favoriteCell.push(<MyFavoriteCell  keyVal={favorite.keyVal}  shop={favorite.shop} distance={favorite.distance} flavorName={favorite.flavorName} edit={this.state.isEditMode} onPress={(location)=>this.openExternalMaps(location)} removeFavorite={(key)=>this.removeFavorite(key)}/>)
})



    return (
      <Container>

      <View style={{width: deviceWidth, height: deviceHeight * 0.14, flexDirection:'row'}}>
          <Image source={logoCow} style={{marginLeft: 10, width: deviceWidth/2.2, height: deviceHeight/6.2, alignSelf:'flex-start', marginTop: 0, resizeMode: 'contain'}}/>

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
  distanceArray: state.shopData.name
});

export default connect(mapStateToProps, bindActions)(MyFavorite);
