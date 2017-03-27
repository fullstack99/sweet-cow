
import React, { Component } from 'react';
import { Image, Dimensions, Alert, ActivityIndicator, TouchableOpacity, ScrollView, Linking, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container, Content, Button, View, Text } from 'native-base';
import { setUser } from '../../actions/user';
import HyperlinkButton from '../base/hyperlinkButton/'
import { openExternalMaps } from '../../utils/';
import SearchResultCell from '../SearchResultCell/searchResultCell'
import TextField from '../base/textField/'
import FirDatabase from "../../database/";



const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const search_icon = require('../../../images/search-icon.png');
const cross_Icon = require('../../../images/Cross_Icon.png');




const {
  replaceAt,
    popRoute,
    pushRoute,
} = actions;

class SearchScreen extends Component {

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
      searchText: '',
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


  onSearchChangeText(search){
      this.setState({searchText: search})
  }

  openExternalMaps(location){
    openExternalMaps(location,this.props.lastPosition)
  }

  searchResultCell(flavorName, shop, distance){
    let isFavorite = this.checkFavorite(flavorName,shop.id)
    return(
      <SearchResultCell flavorName={flavorName} shop={shop} distance={distance} isFavorite={isFavorite}  onPress={(location)=>this.openExternalMaps(location)} setFavorites={(details)=>this.setFavorites(details)}/>
    )
  }

  setFavorites(details){
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

  setUser(user) {
    this.props.setUser(user);
  }

  checkFavorite(flavorName, shopId){
    let isFavorite = false
    let favorites = this.props.user.favorites

    favorites.map((favorite)=>{
      if(favorite.shopId == shopId && favorite.flavorName === flavorName){
        isFavorite = true
      }
    })
    return isFavorite
  }

  render() {
    let borderwidth = 6
    let searchResultArray = []
    let searchResultCell = []
    if(this.state.searchText.length > 0){
      this.props.distanceArray.map((shop)=>{
        if(shop.coordinatesObj.shop !== null){
            if(shop.coordinatesObj.shop != undefined){
                shop.coordinatesObj.shop.flavors.map((flavor)=>{
                  if(flavor.flavor.toUpperCase().includes(this.state.searchText.toUpperCase())){
                    let element = {flavorName:flavor.flavor, shop:shop.coordinatesObj.shop, distance:shop.distance}
                    searchResultArray.push(element)
                  }
                })
            }
        }
      })
    }

    searchResultArray.map((searchResult)=>{
      searchResultCell.push(this.searchResultCell(searchResult.flavorName, searchResult.shop, searchResult.distance))
    })

    return (
      <Container>
      <View style={{backgroundColor:'rgba(243,243,243,1)', width: deviceWidth*0.9, height: deviceHeight * 0.9, borderWidth:borderwidth, borderColor:'rgba(29, 16, 96, 1)', alignSelf:'center', marginTop:deviceHeight*0.05 }}>

    <View style={{marginTop: 10, width:deviceWidth*0.85, flexDirection: 'row', alignSelf:'center', height:50}}>
      <Image source={search_icon} style={{marginLeft: 10, alignSelf: 'center', width: deviceWidth/12, height: deviceHeight/12, marginTop: 2, resizeMode: 'contain'}}/>
      <TextInput placeholder='Search Flavor' placeholderTextColor='rgba(89, 135, 198, 1)' placeholderFont='Typeka Mix'
        style={{width:deviceWidth*0.6, marginLeft: 5, color: 'rgba(89, 135, 198, 1)', fontSize: 20,fontFamily:'Typeka Mix'}}
        onChangeText={(text)=>this.onSearchChangeText(text)}
        underlineColorAndroid='rgba(0,0,0,0)'
        autoCorrect={false}
      />
      <TouchableOpacity style={{ alignSelf:'center'}} onPress={this.props.crossAction}>
        <Image source={cross_Icon} style={{ alignSelf:'center', width: deviceWidth/15, height: deviceWidth/15, resizeMode: 'contain'}}/>
      </TouchableOpacity>
    </View>

      <ScrollView>
      {searchResultCell}
      </ScrollView>
      </View>

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
  user: state.user.name
});

export default connect(mapStateToProps, bindActions)(SearchScreen);
