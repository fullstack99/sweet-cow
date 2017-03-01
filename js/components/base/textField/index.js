import React, { Component } from 'react';
import { View, Text, TextInput, Dimensions, Image } from 'react-native';
import { Item, Icon, Input } from 'native-base';
import styles from './style';
const deviceWidth = Dimensions.get('window').width;
const email_icon = require('../../../../images/email-icon.png');


export default class TextField extends Component{


  static propTypes = {
    iconImage: React.PropTypes.string,
    width: React.PropTypes.number,
    placeholder: React.PropTypes.string,
    labelName: React.PropTypes.string,
    isSecureEntry: React.PropTypes.bool,
  }


  // Specifies the default values for props:
  static defaultProps = {
    iconImage: email_icon,
    width: deviceWidth * 0.9,
    placeholder: "",
    labelName: "Name:",
    isSecureEntry: false
  };

  render(){

    return(

      <View style={[styles.textField, {width: this.props.width}]}>
      <Image source={this.props.iconImage} style={{marginLeft: 15, alignSelf: 'center', width: 15,height:15, marginTop: 2, resizeMode: 'contain'}}/>

      <Text style={{alignSelf: 'center', marginLeft: 10, fontSize: 20, color: '#1f1360'}}>{this.props.labelName}</Text>
      <TextInput placeholder={this.props.placeholder}
        style={{flex: 1, marginLeft: 5, color: '#1f1360', fontSize: 20}}
        onChangeText={this.props.onChangeText}
        secureTextEntry={this.props.isSecureEntry}
      />
      </View>

    );
  }

}
