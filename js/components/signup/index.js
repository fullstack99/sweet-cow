
import React, { Component } from 'react';
import { Image, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container, Content, Button, View, Text } from 'native-base';
import TextField from '../base/textField/'
import CustomButton from '../base/button/'
import HyperlinkButton from '../base/hyperlinkButton/'

import { setUser } from '../../actions/user';
import * as firebase from "firebase";
import FirDatabase from "../../database/";
import Loading from '../base/loading/'


const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const {
  replaceAt,
} = actions;

const background = require('../../../images/background_login.png');
const logoCow = require('../../../images/Blue_Sweet_cow_logo.png');
const logo_title = require('../../../images/logo_title_login.png');
const email_icon = require('../../../images/email-icon.png');
const user_icon = require('../../../images/user-icon_textfield.png');
const password_icon = require('../../../images/lock-icon.png');


class SignUp extends Component {

  static propTypes = {
    setUser: React.PropTypes.func,
    replaceAt: React.PropTypes.func,
    navigation: React.PropTypes.shape({
      key: React.PropTypes.string,
    }),
  }

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      isLoading: false
    };
  }

  setUser(name) {
    this.props.setUser(name);
  }

  replaceRoute(route) {
    this.props.replaceAt('signup', { key: route }, this.props.navigation.key);
  }

  onNameChangeText(name){
    this.setState({name})
  }

  onEmailChangeText(email){
    this.setState({email})
  }

  onPasswordChangeText(password){
      this.setState({password})
  }

  signupButtonPress(){

    if(this.state.name == ""){
      Alert.alert(
        'Error',
        'Please enter name.',
      )
    }
    else if(this.state.email == ""){
      Alert.alert(
        'Error',
        'Please enter email address.',
      )
    }
    else if(this.state.password == ""){
      Alert.alert(
        'Error',
        'Please enter password.',
      )
    }
    else{
      this.setState({isLoading: true})
      this.signup()
    }
  }

  async signup() {

    try {
        await firebase.auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password).then((userData) =>
      {



        try{
          FirDatabase.setUserData(userData.uid, this.state.email, this.state.name)
          setTimeout(() => {
              this.replaceRoute("login")
              this.setState({isLoading: false})
          }, 150);

        }
        catch(error){

          Alert.alert(
            'Error',
            `${error.toString()}`,
          )
          this.setState({isLoading: false})
        }
      })

        // Navigate to the Home page, the user is auto logged in

    } catch (error) {
        console.log(error.toString())

        Alert.alert(
          'Error',
          `${error.toString()}`,
        )
        this.setState({isLoading: false})
    }

  }


  render() {
    let deviceHeightDiff = deviceHeight/568.0
    if(deviceHeightDiff > 1){
      deviceHeightDiff += 0.25
    }
    return (
      <Container>
        <Content bounces={false} style={{flex: 1, flexDirection: 'column', backgroundColor: 'white'}}>
        <Image source={background} style={{flex: 1, width: deviceWidth, height: deviceHeight, resizeMode: 'stretch', marginLeft:3}}>
          <Image source={logoCow} style={{width: deviceWidth/2.2, height: deviceHeight/6.2, alignSelf:'center', marginTop: 30*deviceHeightDiff, resizeMode: 'contain'}}/>
          <Image source={logo_title} style={{width: deviceWidth/2.2, height: deviceHeight/8.0, alignSelf:'center', marginTop: -10, resizeMode: 'contain'}}/>
          <View style={{marginTop: 10*deviceHeightDiff}}>
          <TextField width={deviceWidth * 0.85} labelName="NAME:"  iconImage={user_icon} onChangeText={(text)=>this.onNameChangeText(text)}/>
          </View>
          <View style={{marginTop: 10*deviceHeightDiff}}>
          <TextField width={deviceWidth * 0.85} labelName="EMAIL:" iconImage={email_icon} onChangeText={(text)=>this.onEmailChangeText(text)}/>
          </View>
          <View style={{marginTop: 10*deviceHeightDiff}}>
          <TextField width={deviceWidth * 0.85} labelName="PASSWORD:" iconImage={password_icon} isSecureEntry={true} onChangeText={(text)=>this.onPasswordChangeText(text)}/>
          </View>
          <View style={{marginTop: 12*deviceHeightDiff}}>
          <CustomButton width={deviceWidth * 0.85} text="SIGN UP" backgroundColor="#5B82B8" onPress={()=>this.signupButtonPress()}/>
          </View>
          <View style={{marginTop: 12*deviceHeightDiff, backgroundColor:'rgba(0,0,0,0)'}}>
          <Text style={{color: "#422575", alignSelf:'center'}}> OR CONNECT WITH </Text>
          </View>
          <View style={{marginTop: 12*deviceHeightDiff}}>
          <CustomButton width={deviceWidth * 0.85} text="FACEBOOK" backgroundColor="#422575" onPress={()=>this.signupButtonPress()}/>
          </View>
          <View style={{marginTop: 10*deviceHeightDiff, flex: 1, flexDirection: 'row',backgroundColor:'rgba(0,0,0,0)', justifyContent:'center'}}>
          <Text> Already have an account? </Text>
          <HyperlinkButton width={deviceWidth * 0.25} text="Login" textColor="#422575" fontSize={15} onPress={()=>this.replaceRoute("login")}/>
          </View>
        </Image>

        <Loading isLoading={this.state.isLoading}/>
        </Content>
      </Container>
    );
  }
}

function bindActions(dispatch) {
  return {
    replaceAt: (routeKey, route, key) => dispatch(replaceAt(routeKey, route, key)),
    setUser: name => dispatch(setUser(name)),
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
});

export default connect(mapStateToProps, bindActions)(SignUp);
