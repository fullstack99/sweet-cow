import React, { Component } from 'react';
import { View, Text, TextInput, Dimensions, TouchableOpacity } from 'react-native';
import { Item, Icon, Input } from 'native-base';
import styles from './style';
const deviceWidth = Dimensions.get('window').width;


export default class Button extends Component{

  static propTypes = {
    width: React.PropTypes.number,
    text:  React.PropTypes.string,
    backgroundColor: React.PropTypes.string,
    textColor: React.PropTypes.string,
  }


  // Specifies the default values for props:
  static defaultProps = {
    width: deviceWidth * 0.9,
    text: 'Button',
    backgroundColor: 'blue',
    textColor: 'white'
  };

  render(){

    return(
      <TouchableOpacity onPress={this.props.onPress}>
      <View style={[styles.button, {width: this.props.width, backgroundColor: this.props.backgroundColor}]}>
      <Text style={{fontFamily:'ProximaNova-Regular', alignSelf: 'center', marginLeft: 10, fontSize: 25, color: this.props.textColor}}>{this.props.text}</Text>
      </View>
      </TouchableOpacity>

    );
  }

}
