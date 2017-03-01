
import React, { Component } from 'react';
import { Image, Dimensions, Alert, ActivityIndicator, StyleSheet } from 'react-native';
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



const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: deviceWidth,
    height: deviceHeight,
    resizeMode: 'stretch',
    marginLeft:3
  },
  logoCow: {
    width: deviceWidth/2.2,
    height: deviceHeight/6.2,
    alignSelf:'center',
    marginTop: deviceHeight/568.0 > 1 ? 30*(deviceHeight/568.0 + 0.25) : 30*(deviceHeight/568.0),
    resizeMode: 'contain'
  },
  logoTitle: {
    width: deviceWidth/1.7,
    height: deviceHeight/6,
    alignSelf:'center',
    marginTop: 0,
    resizeMode: 'contain'
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

class Login extends Component {

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
      email: '',
      password: '',
      isLoading: false
    };
  }

  setUser(user) {
    this.props.setUser(user);
  }

  replaceRoute(route) {
    this.props.replaceAt('login', { key: route }, this.props.navigation.key);
  }

  onEmailChangeText(email){
    this.setState({email})
  }

  onPasswordChangeText(password){
      this.setState({password})
  }

  loginButtonPress(){
    if(this.state.email == ""){
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
      this.login()
    }
  }

  async login(){
    try {
        await firebase.auth()
            .signInWithEmailAndPassword(this.state.email, this.state.password).then((userData) =>
      {

        try{
          // Listen for UserData Changes
            FirDatabase.listenUserData(userData.uid, (userDataVal) => {
                console.warn(userDataVal.email)
                console.warn(userDataVal.name)
                if(userDataVal.email == undefined || userDataVal.email == ""){
                  Alert.alert(
                    'Error',
                    '',
                  )
                }
                else{
                  this.setUser(userDataVal)
                  this.setState({isLoading: false})
                  this.replaceRoute("mapView")
                }
            });

        }
        catch(error){
          console.warn(`setError: ${error.toString()}`);
          this.setState({isLoading: false})
          Alert.alert(
            'Error',
            `${error.toString()}`,
          )

        }
      })

        // Navigate to the Home page

    } catch (error) {
        console.log(error.toString())
        console.warn(error.toString());
        this.setState({isLoading: false})
        Alert.alert(
          'Error',
          `${error.toString()}`,
        )
    }

  }


  render() {
    let DontText = "Don't have an account?"
    let deviceHeightDiff = deviceHeight/568.0
    if(deviceHeightDiff > 1){
      deviceHeightDiff += 0.25
    }


    return (
      <Container>
        <Content bounces={false}>
        <Image source={background} style={styles.backgroundImage}>
          <Image source={logoCow} style={styles.logoCow}/>
          <Image source={logo_title} style={{width: deviceWidth/2.2, height: deviceHeight/8.0, alignSelf:'center', marginTop: -10, resizeMode: 'contain'}}/>
          <View style={{marginTop: 10*deviceHeightDiff}}>
          <TextField width={deviceWidth * 0.85} labelName="EMAIL:" iconImage={email_icon} onChangeText={(text)=>this.onEmailChangeText(text)}/>
          </View>
          <View style={{marginTop: 10*deviceHeightDiff}}>
          <TextField width={deviceWidth * 0.85} labelName="PASSWORD:" iconImage={password_icon} isSecureEntry={true} onChangeText={(text)=>this.onPasswordChangeText(text)}/>
          </View>
          <View style={{marginTop: 1*deviceHeightDiff,flexDirection:'row', alignSelf: 'center', justifyContent:'flex-end', width: deviceWidth * 0.85}}>
          <View style={{alignSelf: 'flex-end'}}>
          <HyperlinkButton width={deviceWidth * 0.15} text="Forgot Password?" textColor="#422575" fontSize={15} onPress={()=>this.replaceRoute("signup")}/>
          </View>
          </View>
          <View style={{marginTop: 12*deviceHeightDiff}}>
          <CustomButton width={deviceWidth * 0.85} text="LOGIN" backgroundColor="#5B82B8" onPress={()=>this.loginButtonPress()}/>
          </View>

          <View style={{marginTop: 12*deviceHeightDiff, backgroundColor:'rgba(0,0,0,0)'}}>
          <Text style={{color: "#422575", alignSelf:'center'}}> OR LOGIN WITH </Text>
          </View>
          <View style={{marginTop: 12*deviceHeightDiff}}>
          <CustomButton width={deviceWidth * 0.85} text="FACEBOOK" backgroundColor="#422575" onPress={()=>this.signupButtonPress()}/>
          </View>
          <View style={{marginTop: 40*deviceHeightDiff, flex: 1, flexDirection: 'row',backgroundColor:'rgba(0,0,0,0)', justifyContent:'center'}}>
          <Text> {DontText} </Text>
          <HyperlinkButton width={deviceWidth * 0.25} text="Sign Up" textColor="#422575" fontSize={15} onPress={()=>this.replaceRoute("signup")}/>
          </View>
        </Image>

        <Loading isLoading={this.state.isLoading} />
        </Content>
      </Container>
    );
  }
}

function bindActions(dispatch) {
  return {
    replaceAt: (routeKey, route, key) => dispatch(replaceAt(routeKey, route, key)),
    setUser: user => dispatch(setUser(user)),
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
});

export default connect(mapStateToProps, bindActions)(Login);
