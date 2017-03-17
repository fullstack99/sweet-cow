
import React, { Component } from 'react';
import { Image, Dimensions, Alert, ActivityIndicator, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container, Content, Button, View, Text } from 'native-base';
import TextField from '../base/textField/'
import HyperlinkButton from '../base/hyperlinkButton/'
import Loading from '../base/loading/'
import * as firebase from "firebase";
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
const email_icon = require('../../../images/email-icon.png');
const user_icon_textfield = require('../../../images/user-icon_textfield.png');
const password_icon = require('../../../images/lock-icon.png');
const home_icon = require('../../../images/home-icon.png');


const {
  replaceAt,
    popRoute,
    pushRoute,
} = actions;

class MyProfile extends Component {

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
      isLoading: false,
      name: null,
      email: null,
      homeLocationId: -1
    };
  }

  componentDidMount() {
    this.setState({homeLocationId: this.props.user.locationId})
  }

  logoutButtonPressed(){
    this.setState({isLoading: true})
    this.logout()
  }

  async logout() {
    try {
      await firebase.auth().signOut();
      this.setState({isLoading: false})
      this.replaceRoute("home")

    } catch (error) {
      console.log(error);
    }
  }

  replaceRoute(route) {
    let routes = this.props.navigation.routes
    let lastRoute = routes[routes.length - 2]
    lastRoute.key = "home"
    routes[routes.length - 2] = lastRoute
    console.warn(lastRoute)
    // routes.pop()
    // routes.pop()
    this.props.navigation.routes = routes
    // console.warn(this.props.navigation.key)
    // this.pushRoute('home')
    //  this.props.replaceAt('mapView', { key: route }, this.props.navigation.key);

    this.popRoute()
  }

  pushRoute(route){
    this.props.pushRoute({ key: route }, this.props.navigation.key);
  }

  popRoute() {
  this.props.popRoute(this.props.navigation.key);
  }

  onEmailChangeText(email){
      this.setState({email})
  }

  onNameChangeText(name){
      this.setState({name})
  }

  async resetPassword(){
    try {
      await firebase.auth().sendPasswordResetEmail(this.props.user.email).then(() => {
        this.setState({isLoading: false})
        Alert.alert(
          'Success',
          'Reset link sent to your email.'
        )
      }), (error) => {
        this.setState({isLoading: false})
        Alert.alert(
          'Error',
          `${error.toString()}`,
        )
      }

    }
    catch(error){
      this.setState({isLoading: false})
      Alert.alert(
        'Error',
        `${error.toString()}`,
      )
    }
  }

  uiForFaceBookLogin(){
    return(
      <View style={{marginBottom:2, marginTop: 20,  backgroundColor: 'rgba(86,107,155,1)', height: deviceHeight*0.076, width:deviceWidth * 0.85, justifyContent:'center', alignSelf:'center'}}>
          <Text style={{ alignSelf:'center', fontSize: 18, fontFamily: 'ProximaNova-Regular', color: 'white'}}> Logged In with Facebook </Text>
      </View>
    )
  }

  uiForEmailLogin(){
    return(<View>
          <View style={{marginLeft: deviceWidth*0.075, flexDirection:'row', marginTop: 20}}>
            <Image source={email_icon} style={{ width: 20,height:20, resizeMode: 'contain'}}/>
            <Text style={{marginLeft:10 , marginTop: 4, fontSize: 20, color: 'rgba(29, 16, 96, 1)', fontFamily:"Trade Gothic LT Std"}}> EMAIL: </Text>
        </View>
        <TextField width={deviceWidth * 0.85} labelName={this.props.user.email} isEditable={false} onChangeText={(text)=>this.onEmailChangeText(text)}/>

        <View style={{marginLeft: deviceWidth*0.075, flexDirection:'row', marginTop: 20}}>
            <Image source={password_icon} style={{ width: 20,height:20, resizeMode: 'contain'}}/>
            <Text style={{marginLeft:10 , marginTop: 4, fontSize: 20, color: 'rgba(29, 16, 96, 1)', fontFamily:"Trade Gothic LT Std"}}> PASSWORD: </Text>
        </View>
        <TextField width={deviceWidth * 0.85} labelName="*******" isSecureEntry={true} isEditable={false} onChangeText={(text)=>this.onEmailChangeText(text)}/>

        <View style={{marginLeft: deviceWidth*0.075, marginTop: 10, alignSelf:'flex-start'}}>
            <HyperlinkButton width={deviceWidth * 0.15} text="Reset Password" textColor="#422575" fontSize={15} onPress={()=>this.resetPassword()}/>
        </View>
  </View>
  )
}

resetHomeLocationButtonPressed(){
  var locationId = -1
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

resetHomeLocation(){
  return(<HyperlinkButton width={deviceWidth * 0.15} text="Reset" textColor="white" fontSize={15} onPress={()=>this.resetHomeLocationButtonPressed()}/>
)


}

setUser(user) {
  this.props.setUser(user);
}

  render() {
    let borderwidth = 6

    let emailOrFacebookView = this.uiForEmailLogin()
    if(this.props.user.email === ''){
      emailOrFacebookView = this.uiForFaceBookLogin()
    }
    let homeLocationText = 'No Home Location Set'
    let resetButton = null
    if(this.state.homeLocationId !== -1 || this.state.homeLocationId !== undefined){
        this.props.shopsData.map((shop)=>{
          if(shop.id === this.state.homeLocationId){
            homeLocationText = 'Home Location:' +  ' ' + shop.location
            resetButton = this.resetHomeLocation()
          }
        })

    }

    return (
      <Container>

      <View style={{width: deviceWidth, height: deviceHeight * 0.14, flexDirection:'row'}}>
          <Image source={logoCow} style={{marginLeft: 10, width: deviceWidth/2.2, height: deviceHeight/6.2, alignSelf:'flex-start', marginTop: 0, resizeMode: 'contain'}}/>

          <TouchableOpacity onPress={()=>this.popRoute()}>
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


          <View style={{flexDirection:'column', justifyContent: 'center'}}>
              <Text style={{alignSelf:'center', marginTop: 20, fontSize: 35, color: 'rgba(29, 16, 96, 1)', fontFamily:"Trade Gothic LT Std"}}> MY INFO </Text>
          </View>

          <View style={{marginLeft: deviceWidth*0.075, flexDirection:'row', marginTop: 20}}>
              <Image source={user_icon_textfield} style={{ width: 20,height:20, resizeMode: 'contain'}}/>
              <Text style={{marginLeft:10 , marginTop: 4, fontSize: 20, color: 'rgba(29, 16, 96, 1)', fontFamily:"Trade Gothic LT Std"}}> NAME: </Text>
          </View>
          <TextField width={deviceWidth * 0.85} labelName={this.props.user.name} isEditable={false} onChangeText={(text)=>this.onNameChangeText(text)}/>

          {emailOrFacebookView}

          <View style={{width:deviceWidth*0.95, marginBottom:2, marginTop: 20,  backgroundColor: 'rgba(92,133,192,1)', height: deviceHeight*0.076, flexDirection:'row', justifyContent:'space-between', alignSelf:'center'}}>
              <Image source={home_icon} style={{ marginLeft: 20, marginRight: 5, width: deviceWidth/15, height: deviceHeight/15, resizeMode: 'contain'}}/>
              <Text style={{width:deviceWidth*0.6, marginRight: 20,marginLeft: 2, alignSelf:'center', fontSize: 15, fontFamily: 'ProximaNova-Regular', color: 'white'}}>{homeLocationText} </Text>
              <View style={{marginRight: 20, alignSelf:'center'}}>
              {resetButton}
              </View>
          </View>

          <View style={{marginTop: 10, alignSelf:'center'}}>
              <HyperlinkButton width={deviceWidth * 0.15} text="Sign Out" textColor="#422575" fontSize={20} onPress={()=>this.logoutButtonPressed()}/>
          </View>



      <Loading isLoading={this.state.isLoading}/>
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

export default connect(mapStateToProps, bindActions)(MyProfile);
