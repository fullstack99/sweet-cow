
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
import FlavourInfoView from '../ShopDetails/FlavourDetail'



const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const search_icon = require('../../../images/search-icon.png');
const cross_Icon = require('../../../images/Cross_Icon.png');


let flavorDetail = null

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
      isInfoMode: false
    };
  }

  componentDidMount() {

  }

  flavorInfoDismiss() {
    this.setState({ isInfoMode: false })
  }

  pushRoute(route) {
    this.props.pushRoute({ key: route }, this.props.navigation.key);
  }

  popRoute() {
    this.props.popRoute(this.props.navigation.key);
  }


  onSearchChangeText(search) {
    this.setState({ searchText: search })
  }

  openExternalMaps(location) {
    openExternalMaps(location, this.props.lastPosition)
  }

  openFlavorInfo(flavorData, shop, isFavorite) {
    console.warn(isFavorite)
    let flavorElement = { flavorData: flavorData, isFavorite: isFavorite, shopId: shop.id }
    flavorDetail = flavorElement
    this.setState({ isInfoMode: true })
  }

  searchResultCell(flavorData, shop, distance, isAvailable) {
    let isFavorite = false
    let favKey = null
    if (this.props.user) {
      isFavorite = this.checkFavorite(flavorData.flavor, shop.id)
      favKey = this.getFavoriteKey(flavorData.flavor, shop.id)

    }

    return (
      <SearchResultCell flavorData={flavorData} shop={shop} distance={distance} isFavorite={isFavorite} favKey={favKey} isAvailable={isAvailable} onPress={(location) => this.openExternalMaps(location)} changeFavorites={(details) => this.changeFavouriteState(details)} openFlavorInfo={(flavorData, shop, isFavorite) => this.openFlavorInfo(flavorData, shop, isFavorite)} />
    )
  }

  setFavoritesFromDetails(flavorData, isFavorite) {
    if (this.props.user) {
      console.warn(isFavorite);
      let shopId = flavorDetail.shopId;
      let favId = this.getFavoriteKey(flavorData.flavor, shopId)
      console.warn(favId)
      let element = { flavorName: flavorData.flavor, shopId: shopId, isFavorite: isFavorite, key: favId }
      this.changeFavouriteState(element)
    } else {
      this.loginConfimation()
    }
  }

  changeFavouriteState(details) {
    if (this.props.user) {
      if (details.isFavorite === false) {
        console.warn("add to fav")
        this.setFavorites(details)
      }
      else {
        console.warn("remove from fav")
        this.removeFavorites(details)
      }
    } else {
      this.loginConfimation()
    }

  }

  loginConfimation() {
    Alert.alert(
      'Confirm',
      'This action requires login, do you want to login or create an account?',
      [
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: 'Yes', onPress: () => this.goToLogin() },
      ],
      { cancelable: false }
    )
  }


  goToLogin() {
    this.props.pushRoute({ key: 'home' }, this.props.navigation.key);
  }

  removeFavorites(details) {
    try {
      FirDatabase.removeFavorites(this.props.user.uid, details)
      FirDatabase.getFavoritesCount(details, (data) => {
        console.warn(data.count);

        let value = data.count - 1
        if (value < 0) {
          value = 0
        }
        FirDatabase.setFavoritesCount(details, value)
      })

      let user = this.props.user
      // removing from users

      let tempUSerArray = []
      user.favorites.map((fav) => {
        if (fav.key !== details.key) {
          tempUSerArray.push(fav)
        }
      })
      user.favorites = tempUSerArray
      this.setUser(user)
      this.forceUpdate()
    }
    catch (error) {

      this.setState({ isLoading: false })
      Alert.alert(
        'Error',
        `${error.toString()}`,
      )
    }
  }

  setFavorites(details) {

    try {

      let key = FirDatabase.setFavorites(this.props.user.uid, details)
      let detailVal = { key: key, flavorName: details.flavorName, shopId: details.shopId }

      FirDatabase.getFavoritesCount(details, (data) => {
        console.warn(data.count);
        let value = data.count + 1
        FirDatabase.setFavoritesCount(details, value)
      })

      let user = this.props.user
      user.favorites.push(detailVal)
      this.setUser(user)
      this.forceUpdate()
    }
    catch (error) {

      this.setState({ isLoading: false })
      Alert.alert(
        'Error',
        `${error.toString()}`,
      )
    }
  }

  setUser(user) {
    this.props.setUser(user);
  }

  checkFavorite(flavorName, shopId) {
    let isFavorite = false
    let favorites = this.props.user.favorites

    favorites.map((favorite) => {
      if (favorite.flavorName === flavorName) {
        isFavorite = true
      }
    })
    return isFavorite
  }

  getFavoriteKey(flavorName, shopId) {
    let favKey = ""
    let favorites = this.props.user.favorites

    favorites.map((favorite) => {
      if (favorite.flavorName === flavorName) {
        favKey = favorite.key
      }
    })
    return favKey
  }

  render() {
    let borderwidth = 6
    let searchResultArray = []
    let searchResultCell = []

    if (this.state.searchText.length > 0) {
      this.props.distanceArray.map((shop) => {
        if (shop.coordinatesObj.shop !== null) {
          if (shop.coordinatesObj.shop != undefined) {
            shop.coordinatesObj.shop.flavors.map((flavor) => {
              if (flavor.flavor.toUpperCase().includes(this.state.searchText.toUpperCase())) {
                //***************Use flavorData.Searchable and remove the following*/
                let isSearchable = 0
                if (flavor.flavor.toUpperCase().includes('CHOCOLATE')) {
                  isSearchable = 1// flavor.Searchable
                }
                //************************/

                if (isSearchable == 1) {
                  let element = { flavorData: flavor, shop: shop.coordinatesObj.shop, distance: shop.distance, isAvailable: true }
                  searchResultArray.push(element)
                }
              }
            })
          }
        }
      })
      this.props.distanceArray.map((shop) => {
        if (shop.coordinatesObj.shop !== null) {
          if (shop.coordinatesObj.shop != undefined) {
            shop.coordinatesObj.shop.flavors.map((flavor) => {
              if (flavor.flavor.toUpperCase().includes(this.state.searchText.toUpperCase())) {
                //***************Use flavorData.Searchable and remove the following*/
                let isSearchable = 0
                if (flavor.flavor.toUpperCase().includes('CHOCOLATE')) {
                  isSearchable = 1// flavor.Searchable
                }
                //************************/

                if (isSearchable == 0) {
                  let element = { flavorData: flavor, shop: shop.coordinatesObj.shop, distance: shop.distance, isAvailable: false }
                  searchResultArray.push(element)
                }
              }
            })
          }
        }
      })
    } else {
      this.props.distanceArray.map((shop) => {
        if (shop.coordinatesObj.shop !== null) {
          if (shop.coordinatesObj.shop != undefined) {
            shop.coordinatesObj.shop.flavors.map((flavor) => {

              //***************Use flavorData.Searchable and remove the following*/
              let isSearchable = 0
              if (flavor.flavor.toUpperCase().includes('CHOCOLATE')) {
                isSearchable = 1// flavor.Searchable
              }
              //************************/

              if (isSearchable == 1) {
                let element = { flavorData: flavor, shop: shop.coordinatesObj.shop, distance: shop.distance, isAvailable: true }
                searchResultArray.push(element)
              }

            })
          }
        }
      })
      this.props.distanceArray.map((shop) => {
        if (shop.coordinatesObj.shop !== null) {
          if (shop.coordinatesObj.shop != undefined) {
            shop.coordinatesObj.shop.flavors.map((flavor) => {

              //***************Use flavorData.Searchable and remove the following*/
              let isSearchable = 0
              if (flavor.flavor.toUpperCase().includes('CHOCOLATE')) {
                isSearchable = 1// flavor.Searchable
              }
              //************************/

              if (isSearchable == 0) {
                let element = { flavorData: flavor, shop: shop.coordinatesObj.shop, distance: shop.distance, isAvailable: false }
                searchResultArray.push(element)
              }

            })
          }
        }
      })
    }


    // if(searchResultArray.length === 0){
    //   console.warn(this.props.searchData);
    //   this.props.searchData.map((searchObj)=>{
    //         if(searchObj != undefined){
    //             searchObj.flavors.map((flavor)=>{
    //               if(flavor.flavor.toUpperCase().includes(this.state.searchText.toUpperCase())){
    //                 let element = {flavorData:flavor, shop:searchObj, distance:0, isAvailable:false}
    //                 console.warn(flavor);
    //                 searchResultArray.push(element)
    //               }
    //             })
    //         }
    //   })
    // }


    // this.props.searchData.map((searchObj) => {
    //   if (searchObj != undefined) {
    //     searchObj.flavors.map((flavor) => {

    //       var isAlreadyAdded = false;
    //       searchResultArray.map((addedFlavour) => {

    //         if (addedFlavour.flavorData.flavor.toUpperCase() === flavor.flavor.toUpperCase()) {
    //           isAlreadyAdded = true;
    //         }
    //       })

    //       if (isAlreadyAdded === false && flavor.flavor.toUpperCase().includes(this.state.searchText.toUpperCase())) {
    //         let element = { flavorData: flavor, shop: searchObj, distance: 0, isAvailable: false }
    //         console.warn(flavor);
    //         searchResultArray.push(element)
    //       }
    //     })
    //   }
    // })

    searchResultArray.map((searchResult) => {
      searchResultCell.push(this.searchResultCell(searchResult.flavorData, searchResult.shop, searchResult.distance, searchResult.isAvailable))
    })


    return (
      <Container>
        <View style={{ backgroundColor: 'rgba(243,243,243,1)', width: deviceWidth * 0.9, height: deviceHeight * 0.9, borderWidth: borderwidth, borderColor: 'rgba(29, 16, 96, 1)', alignSelf: 'center', marginTop: deviceHeight * 0.05 }}>

          <View style={{ marginTop: 10, width: deviceWidth * 0.85, flexDirection: 'row', alignSelf: 'center', height: 50 }}>
            <Image source={search_icon} style={{ marginLeft: 10, alignSelf: 'center', width: deviceWidth / 12, height: deviceHeight / 12, marginTop: 2, resizeMode: 'contain' }} />
            <TextInput autoFocus={true} placeholder='Search Flavor' placeholderTextColor='rgba(89, 135, 198, 1)' placeholderFont='Typeka Mix'
              style={{ width: deviceWidth * 0.6, marginLeft: 5, color: 'rgba(89, 135, 198, 1)', fontSize: 20, fontFamily: 'Typeka Mix' }}
              onChangeText={(text) => this.onSearchChangeText(text)}
              underlineColorAndroid='rgba(0,0,0,0)'
              autoCorrect={false}
            />
            <TouchableOpacity style={{ alignSelf: 'center' }} onPress={this.props.crossAction}>
              <Image source={cross_Icon} style={{ alignSelf: 'center', width: deviceWidth / 15, height: deviceWidth / 15, resizeMode: 'contain' }} />
            </TouchableOpacity>
          </View>

          <ScrollView>
            {searchResultCell}
          </ScrollView>


        </View>
        <FlavourInfoView isInfoMode={this.state.isInfoMode} flavorData={flavorDetail}
          crossAction={() => this.flavorInfoDismiss()} setFavoritesAction={(flavorData, isFavorite) => this.setFavoritesFromDetails(flavorData, isFavorite)}
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
  searchData: state.searchData.name

});

export default connect(mapStateToProps, bindActions)(SearchScreen);
