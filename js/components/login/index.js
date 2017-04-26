
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
import { LoginManager, AccessToken } from 'react-native-fbsdk';


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
      isLoading: false,
      token: ''
    };

  }

  componentWillUnmount() {
    this.listenUserData = undefined
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


async resetPassword(){

  if(this.state.email === ""){
    return;
  }

  this.setState({isLoading: true})

  try {
    await firebase.auth().sendPasswordResetEmail(this.state.email).then(() => {
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



  async login(){
    try {
        await firebase.auth()
            .signInWithEmailAndPassword(this.state.email, this.state.password).then((userData) =>
      {

        try{
          // Listen for UserData Changes
            this.listenUserData = FirDatabase.listenUserData(userData.uid, (userDataVal) => {
                // console.warn(userDataVal.email)
                // console.warn(userDataVal.name)
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


  async loginWithFacebook(){
    // Attempt a login using the Facebook login dialog,
// asking for default permissions.
this.setState({isLoading: true})

await LoginManager.logInWithReadPermissions(['public_profile']).then((result) => {
    if (result.isCancelled) {
      this.setState({isLoading: false})
      alert('Login was cancelled');

    } else {

        // console.warn(result.toString());
        // console.log(result)
        AccessToken.getCurrentAccessToken().then(
                  (data) => {
                    // alert(data.accessToken.toString())
                    const { accessToken } = data
                    fetch('https://graph.facebook.com/v2.5/me?fields=email,name,friends&access_token=' + accessToken)
                    .then((response) => response.json())
                    .then((json) => {
                      // Some user object has been set up somewhere, build that user here

                      var name = ""
                      var emailId = ""
                      if(json.name){
                        name = json.name
                      }
                      if(json.email){
                        email = json.email
                      }

                      const auth = firebase.auth();
                      const provider = firebase.auth.FacebookAuthProvider;

                      const credential = provider.credential(data.accessToken);
                      auth.signInWithCredential(credential).then((userData) => {
                        console.warn(`test ${data}`)
                        
                        try{
                          FirDatabase.updateUserData(userData.uid, emailId, name)
                          setTimeout(() => {
                              // this.replaceRoute("mapView")
                              // this.setState({isLoading: false})
                              console.warn("here")
                              this.getLoginData(userData.uid)
                          }, 150);

                        }
                        catch(error){

                          this.setState({isLoading: false})
                          Alert.alert(
                            'Error',
                            `${error.toString()}`,
                          )
                          //
                        }

                      })

                    })
                    .catch((error) => {
                      console.warn(`error ${error.toString()}`)
                      this.setState({isLoading: false})
                      Alert.alert(
                        'Error',
                        `${error.toString()}`,
                      )
                      // reject('ERROR GETTING DATA FROM FACEBOOK')
                    })
                  }
                )
    }
  },
  (error) => {
    this.setState({isLoading: false})
    alert('' + error.toString());
  }
);
  }

  getLoginData(uid){
    try{
      // Listen for UserData Changes
        this.listenUserData = FirDatabase.listenUserData(uid, (userDataVal) => {
            console.warn(userDataVal)
            // console.warn(userDataVal.name)
            if(userDataVal.email == undefined){
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
  }

  initUser(token) {
    fetch('https://graph.facebook.com/v2.5/me?fields=email,name,friends&access_token=' + token)
    .then((response) => response.json())
    .then((json) => {
      // Some user object has been set up somewhere, build that user here
      alert(json.toString())
      // user.name = json.name
      // user.id = json.id
      // user.user_friends = json.friends
      // user.email = json.email
      // user.username = json.name
      // user.loading = false
      // user.loggedIn = true
      // user.avatar = setAvatar(json.id)
    })
    .catch(() => {
      reject('ERROR GETTING DATA FROM FACEBOOK')
    })
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
          <TextField text={this.state.email} width={deviceWidth * 0.85} labelName="EMAIL:" iconImage={email_icon} onChangeText={(text)=>this.onEmailChangeText(text)}/>
          </View>
          <View style={{marginTop: 10*deviceHeightDiff}}>
          <TextField width={deviceWidth * 0.85} labelName="PASSWORD:" iconImage={password_icon} isSecureEntry={true} onChangeText={(text)=>this.onPasswordChangeText(text)}/>
          </View>
          <View style={{marginTop: 1*deviceHeightDiff,flexDirection:'row', alignSelf: 'center', justifyContent:'flex-end', width: deviceWidth * 0.85}}>
          <View style={{alignSelf: 'flex-end'}}>
          <HyperlinkButton width={deviceWidth * 0.15} text="Forgot Password?" textColor="#422575" fontSize={15} onPress={()=>this.resetPassword()}/>
          </View>
          </View>
          <View style={{marginTop: 12*deviceHeightDiff}}>
          <CustomButton width={deviceWidth * 0.85} text="LOGIN" backgroundColor="#5B82B8" onPress={()=>this.loginButtonPress()}/>
          </View>

          <View style={{justifyContent:'center', flexDirection:'row',marginTop: 12*deviceHeightDiff, backgroundColor:'rgba(0,0,0,0)'}}>
          <Text style={{marginTop:-6, fontFamily:'ProximaNova-Regular', color: "rgba(27,13,99,1)", alignSelf:'center'}}>. . . </Text>
          <Text style={{fontFamily:'ProximaNova-Regular', color: "rgba(27,13,99,1)", alignSelf:'center'}}>OR LOGIN WITH</Text>
          <Text style={{marginTop:-6, fontFamily:'ProximaNova-Regular', color: "rgba(27,13,99,1)", alignSelf:'center'}}> . . .</Text>
          </View>
          <View style={{marginTop: 12*deviceHeightDiff}}>
          <CustomButton width={deviceWidth * 0.85} text="FACEBOOK" backgroundColor="#422575" onPress={()=>this.loginWithFacebook()}/>
          </View>
          <View style={{marginTop: 40*deviceHeightDiff, flex: 1, flexDirection: 'row',backgroundColor:'rgba(0,0,0,0)', justifyContent:'center'}}>
          <Text> {DontText} </Text>
          <HyperlinkButton width={deviceWidth * 0.25} text="Sign Up" textColor="rgba(27,13,99,1)" fontSize={15} onPress={()=>this.replaceRoute("signup")}/>
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
