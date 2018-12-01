import React, { Component } from 'react';
import { View, Text, TextInput, Dimensions, Image } from 'react-native';
import { Item, Icon, Input } from 'native-base';

import styles from './style';

const deviceWidth = Dimensions.get('window').width;
const email_icon = require('../../../../images/email-icon.png');

export default class TextField extends Component {


  static propTypes = {
    iconImage: React.PropTypes.string,
    width: React.PropTypes.number,
    placeholder: React.PropTypes.string,
    labelName: React.PropTypes.string,
    isSecureEntry: React.PropTypes.bool,
    isEditable: React.PropTypes.bool,
  }


  // Specifies the default values for props:
  static defaultProps = {
    iconImage: null,
    width: deviceWidth * 0.9,
    placeholder: "",
    labelName: "",
    isSecureEntry: false,
    isEditable: true
  };

  render() {
    let imageDimension = 15
    if (this.props.iconImage === null) {
      imageDimension = 0
    }
    return (

      <View style={[styles.textField, { width: this.props.width }]}>
        <Image source={this.props.iconImage} style={{ marginLeft: 15, alignSelf: 'center', width: imageDimension, height: imageDimension, marginTop: 2, resizeMode: 'contain' }} />
        <TextInput placeholder={this.props.labelName} placeholderTextColor='#1f1360'
          style={{ flex: 1, marginLeft: 5, color: '#1f1360', fontSize: 20 }}
          onChangeText={this.props.onChangeText}
          secureTextEntry={this.props.isSecureEntry}
          editable={this.props.isEditable}
          underlineColorAndroid='rgba(0,0,0,0)'
          autoCorrect={false}
        />
      </View>

    );
  }

}
