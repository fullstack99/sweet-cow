
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';
import * as firebase from "firebase";

export default class AppNavigator extends Component {

  constructor(props){
    super(props)
    firebase.initializeApp({
      apiKey: "AIzaSyC8D1CA3tzwOocmUnhkusTM_fDBFslc07A",
      authDomain: "sweet-cow-df10d.firebaseapp.com",
      databaseURL: "https://sweet-cow-df10d.firebaseio.com",
      storageBucket: "sweet-cow-df10d.appspot.com"
    });
  }

  async signup(email, pass) {

    try {
        await firebase.auth()
            .createUserWithEmailAndPassword(email, pass);

        console.log("Account created");
        console.warn("Account created");

        // Navigate to the Home page, the user is auto logged in

    } catch (error) {
        console.log(error.toString())
        console.warn(error.toString());
    }

}

async login(email, pass) {

    try {
        await firebase.auth()
            .signInWithEmailAndPassword(email, pass).then((userData) =>
      {
        console.warn(`login: ${userData.uid} data: ${JSON.stringify(userData)}`)

        let userNamePath = "/user/" + userData.uid + "/details";

        try{
          firebase.database().ref(userNamePath).set({
              Name: "Kapil Bindal",
              Email: userData.email
          })
          console.warn("success")
        }
        catch(error){
          console.warn(`setError: ${error.toString()}`);
        }



      })

        // Navigate to the Home page

    } catch (error) {
        console.log(error.toString())
        console.warn(error.toString());
    }

}

  handleSignupPressed(){
    this.signup("a@test.com", "123456")
  }

  handleLoginPressed(){
    this.login("a@test.com", "123456")
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.ios.js
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>

        <Button
  onPress={() => this.handleSignupPressed()}
  title="Sign Up"
  color="#841584"
  accessibilityLabel="Learn more about this purple button"
/>
<Button
onPress={() => this.handleLoginPressed()}
title="Login"
color="#841584"
accessibilityLabel="Learn more about this purple button"
/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
