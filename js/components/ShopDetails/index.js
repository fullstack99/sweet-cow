
import React, { Component } from 'react';
import { Image, Dimensions, Alert, ActivityIndicator, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container, Content, Button, View, Text } from 'native-base';
import FirDatabase from "../../database/";
import { setUser } from '../../actions/user';



const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const background = require('../../../images/background_ShopDetails.png');
const logoCow = require('../../../images/logo_cow_horizontal.png');
const map_icon = require('../../../images/map-locator.png');
const search_icon = require('../../../images/search-icon.png');
const favorite_icon = require('../../../images/favorite-icon.png');
const user_icon = require('../../../images/user-icon.png');
const miles_icon = require('../../../images/miles-away-icon-white.png');
const call_icon = require('../../../images/Call.png');
const home_icon = require('../../../images/home-icon.png');
const favorite_icon_brown = require('../../../images/like.png');
const next_page_icon_brown = require('../../../images/next-page.png');


const {

    popRoute,

} = actions;

class ShopDetails extends Component {

  static propTypes = {
    navigation: React.PropTypes.shape({
      key: React.PropTypes.string,
      popRoute: React.PropTypes.func,
    }),
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      homeLocationId: -1
    };
  }

  componentDidMount() {
    this.setState({homeLocationId: this.props.user.locationId})
  }

  popRoute() {
  this.props.popRoute(this.props.navigation.key);
  }

makePhoneCall(phone){


  Linking.canOpenURL(phone).then(supported => {
    if (!supported) {
      return Linking.openURL(phone);
    } else {
      return Linking.openURL(phone);
    }
  }).catch(err => console.error('An error occurred', err));

}

  openExternalMAps(location){
    var destination = location
    destination = destination.replace(/\s/g, "+");
    let url = 'comgooglemaps://?saddr='+this.props.lastPosition.coords.latitude+','+this.props.lastPosition.coords.longitude+'&daddr='+destination+'&directionsmode=drive'
    // if(Platform.OS !== 'android'){
    //   url = 'http://maps.apple.com/?saddr=sll='+this.state.lastPosition.coords.latitude+','+this.state.lastPosition.coords.longitude+'&daddr='+destination+'&dirflg=r'
    // }

    Linking.canOpenURL(url).then(supported => {
      if (!supported) {
        url = 'http://maps.apple.com/?saddr=sll='+this.props.lastPosition.coords.latitude+','+this.props.lastPosition.coords.longitude+'&daddr='+destination+'&dirflg=r'
        return Linking.openURL(url);
      } else {
        return Linking.openURL(url);
      }
    }).catch(err => console.error('An error occurred', err));
  }

  getFlavourCell(flavor, flavorColor){

    return(

      <TouchableOpacity style={{backgroundColor:'white', marginLeft:10, marginRight:10,marginBottom:10, height:50, flexDirection:'row', justifyContent:"space-between"}}>
      <Image source={favorite_icon_brown} style={{ alignSelf:'center', marginLeft: 20, marginRight: 5, width: 25, height: 25, resizeMode: 'contain'}}/>
      <Text style={{width:deviceWidth*0.6, color:flavorColor, alignSelf:'center', textAlign:'center', fontSize: 18,  fontFamily:"Typeka Mix"}}>{flavor}</Text>
      <Image source={next_page_icon_brown} style={{ alignSelf:'center', marginLeft: 5, marginRight: 20, width: 25, height: 25, resizeMode: 'contain'}}/>
      </TouchableOpacity>
    )
  }

  homeLocationButton(){
      return(
      <View style={{marginBottom:2, marginTop: 2,  backgroundColor: 'rgba(92,133,192,1)', height: deviceHeight*0.076, marginLeft:10, marginRight:10, flexDirection:'row', justifyContent:'center'}}>
      <Image source={home_icon} style={{alignSelf:'center', marginLeft: 5, marginRight: 5, width: deviceWidth/15, height: deviceHeight/15, resizeMode: 'contain'}}/>
      <Text style={{ alignSelf:'center', fontSize: 15, fontFamily: 'ProximaNova-Regular', color: 'white'}}> Home Location </Text>
      </View>)
    }

  makeHomeLocationButton(locationId){
    return(<TouchableOpacity onPress={()=>this.setHomeLocation(locationId)}>
    <View style={{marginBottom:2, marginTop: 2,  backgroundColor: 'rgba(92,133,192,1)', height: deviceHeight*0.076, marginLeft:10, marginRight:10, flexDirection:'row', justifyContent:'center'}}>
    <Image source={home_icon} style={{alignSelf:'center', marginLeft: 5, marginRight: 5, width: deviceWidth/15, height: deviceHeight/15, resizeMode: 'contain'}}/>
    <Text style={{ alignSelf:'center', fontSize: 15, fontFamily: 'ProximaNova-Regular', color: 'white'}}> Make this my home location </Text>
    </View>
    </TouchableOpacity>)
  }

  setHomeLocation(locationId){
    try{
      FirDatabase.setHomeLocation(this.props.user.uid, locationId)
      this.setState({homeLocationId: locationId})

      let user = this.props.user
      user.locationId = locationId
      this.setUser(user)
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


    let shop = this.props.data.coordinatesObj.shop
    let distance = this.props.data.distance
    let locationId = this.props.user.locationId

    if(locationId === shop.id){
      homeLocationButton = this.homeLocationButton()
    }else{
      homeLocationButton = this.makeHomeLocationButton(shop.id)
    }

    let fulladdress =   shop.address + '+' + shop.location + '+' + shop.state + '+' + shop.zip_code

    // let flavorArray = shop.flavors

    let flavorArray = ['Super Delicious Vanilla', 'Butter Pecan', 'Oatmeal Cookie', 'Chocolate Chip Cookie Dough', 'Chocolate Peanut Butter', 'Dutch Chocolate']
    let flavorsColors = ['rgba(89, 135, 198, 1)', 'rgba(238, 37, 53, 1)', 'rgba(243, 123, 34, 1)', 'rgba(85, 7, 91, 1)', 'rgba(89, 135, 198, 1)', 'rgba(62, 56, 20, 1)']



      var weekdayData = shop.hours[0].split(':');
      var weekDays = weekdayData[0]
      var weekDaysTime = weekdayData[1]

      var weekendData = shop.hours[1].split(':');
      var weekEnds = weekendData[0]
      var weekEndsTime = weekendData[1]



    let formattedAddress =  shop.address + ' - ' + shop.location + ', ' + shop.state + ' ' + shop.zip_code
    let todayFlavorText = "TODAY'S FLAVORS"
    let numberOfFlavors = flavorArray.length
    let phone = 'tel:'+shop.phone

    var flavorCell = []
    var index = 0
    flavorArray.map((flavor)=>{
    flavorCell.push(this.getFlavourCell(flavor, flavorsColors[index%flavorsColors.length]))
    index++
    })

    return (
      <Container>


        <View style={{width: deviceWidth, height: deviceHeight * 0.14, flexDirection:'row'}}>
            <Image source={logoCow} style={{marginLeft: 10, width: deviceWidth/2.2, height: deviceHeight/6.2, alignSelf:'flex-start', marginTop: 0, resizeMode: 'contain'}}/>

            <TouchableOpacity>
                <Image source={map_icon} style={{marginLeft: 25, marginTop: 25, width: deviceWidth/12, height: deviceHeight/12, resizeMode: 'contain'}}/>
            </TouchableOpacity>

            <TouchableOpacity>
                <Image source={search_icon} style={{marginLeft: 8, marginTop: 25, width: deviceWidth/12, height: deviceHeight/12, resizeMode: 'contain'}}/>
            </TouchableOpacity>

            <TouchableOpacity>
                <Image source={favorite_icon} style={{marginLeft: 8, marginTop: 25, width: deviceWidth/12, height: deviceHeight/12, resizeMode: 'contain'}}/>
            </TouchableOpacity>

            <TouchableOpacity>
                <Image source={user_icon} style={{marginLeft: 8, marginTop: 25, width: deviceWidth/12, height: deviceHeight/12, resizeMode: 'contain'}}/>
            </TouchableOpacity>
        </View>



      <View style={{marginLeft:borderwidth/2, marginTop:-borderwidth, backgroundColor:'rgba(29, 16, 96, 1)', width: deviceWidth, height:borderwidth}}>
      </View>

      <ScrollView
      automaticallyAdjustContentInsets={false}
      vertical={true}
      >

      <Text style={{alignSelf:'center', marginTop: 15, fontSize: 15, color: 'rgba(92,133,192,1)', fontFamily:'ProximaNova-Regular'}}> Optional Promo Message Message Subtitle.</Text>
      <Text style={{alignSelf:'center', marginTop: 5, fontSize: 15, color: 'rgba(92,133,192,1)', fontFamily:'ProximaNova-Regular'}}> Get Your Ice Cream Fix...Moo.</Text>

      <TouchableOpacity onPress={()=>this.popRoute()}>
      <View style={{marginBottom:2, marginTop: 20,  backgroundColor: 'rgba(92,133,192,1)', height: 45, marginLeft:10, marginRight:10, justifyContent:'center'}}>
      <Text style={{alignSelf:'center',  fontSize: 18, fontFamily: 'ProximaNova-Regular', color: 'white'}}> VIEW ALL SHOPS </Text>
      </View>
      </TouchableOpacity>


      <View style={{flexDirection:'column', justifyContent: 'center'}}>
      <Text style={{alignSelf:'center', marginTop: 20, fontSize: 25, color: 'rgba(29, 16, 96, 1)', fontFamily:"Trade Gothic LT Std"}}> {shop.location.toUpperCase()} </Text>
      <Text style={{textAlign:'center',width:deviceWidth*0.85, alignSelf:'center', fontSize: 16,  fontFamily: 'ProximaNova-Regular', color: 'rgba(63, 57, 19, 1)'}}>{formattedAddress.toUpperCase()}</Text>
      </View>

      {homeLocationButton}

      <View style={{marginLeft:10, marginRight:10, flexDirection:'row', justifyContent:'center'}}>
      <TouchableOpacity style={{backgroundColor: 'rgba(29,16,96,1)', height: 45 , marginRight:1, flexDirection:'row', justifyContent:'center', flex:1}} onPress={(location)=>this.openExternalMAps(fulladdress)} >
      <Image source={miles_icon} style={{alignSelf:'center', marginLeft: 5, marginRight: 5, width: 25, height: 25, resizeMode: 'contain'}}/>
      <Text style={{alignSelf:'center', fontSize: 13, fontFamily: 'ProximaNova-Regular', color: 'white'}}> GET DIRECTIONS </Text>
      </TouchableOpacity>
      <TouchableOpacity style={{backgroundColor: 'rgba(29,16,96,1)', height: 45 ,marginLeft:1, flexDirection:'row', justifyContent:'center',flex:1}} onPress={() => this.makePhoneCall(phone)}>
      <Image source={call_icon} style={{alignSelf:'center', marginLeft: 5, marginRight: 5, width: 25, height: 25, resizeMode: 'contain'}}/>
      <Text style={{alignSelf:'center', fontSize: 13, fontFamily: 'ProximaNova-Regular', color: 'white'}}> CALL </Text>
      </TouchableOpacity>
      </View>

      <View style={{flexDirection:'column', justifyContent: 'center'}}>
      <Text style={{alignSelf:'center', marginTop: 20, fontSize: 25, color: 'rgba(29, 16, 96, 1)', fontFamily:"Trade Gothic LT Std"}}> HOURS </Text>
      <View style={{flexDirection:'row', justifyContent: 'center', alignSelf:'center', width:deviceWidth*0.98}}>
      <Text style={{alignSelf:'center', fontSize: 13,  fontFamily: 'ProximaNova-Semibold', color: 'rgba(63, 57, 19, 1)'}}>{weekDays}:</Text>
      <Text style={{alignSelf:'center', fontSize: 13,  fontFamily: 'ProximaNova-Regular', color: 'rgba(63, 57, 19, 1)'}}> {weekDaysTime}</Text>
      <Text style={{alignSelf:'center', fontSize: 13,  fontFamily: 'ProximaNova-Semibold', color: 'rgba(63, 57, 19, 1)'}}>   {weekEnds}:</Text>
      <Text style={{alignSelf:'center', fontSize: 13,  fontFamily: 'ProximaNova-Regular', color: 'rgba(63, 57, 19, 1)'}}> {weekEndsTime}</Text>
      </View>
      </View>

<View style={{ marginLeft:borderwidth, marginRight:borderwidth, marginTop: 20, alignSelf:'center', flex:1, width:deviceWidth - (2 * borderwidth)}}>
<Image source={background} style={{flex: 1, width: deviceWidth-(2*borderwidth),height: (60 * numberOfFlavors) + 50, resizeMode: 'stretch'}}>
<Text style={{alignSelf:'center', marginTop: 20, fontSize: 25, fontFamily:"Trade Gothic LT Std"}}>{todayFlavorText}</Text>


{flavorCell}

</Image>
</View>


</ScrollView>


      </Container>
    );
  }
}

function bindActions(dispatch) {
  return {
    setUser: name => dispatch(setUser(name)),
    popRoute: (key) => dispatch(popRoute(key)),
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
  user: state.user.name
});

export default connect(mapStateToProps, bindActions)(ShopDetails);
