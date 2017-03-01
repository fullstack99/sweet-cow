import React, { Component } from 'react';
import { View, Text, TextInput, Dimensions, TouchableOpacity } from 'react-native';
import { Item, Icon, Input } from 'native-base';
import styles from './style';
const deviceWidth = Dimensions.get('window').width;


export default class HyperlinkButton extends Component{

  static propTypes = {
    text:  React.PropTypes.string,
    textColor: React.PropTypes.string,
    fontSize: React.PropTypes.number,
  }


  // Specifies the default values for props:
  static defaultProps = {
    text: 'Button',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    textColor: '#422575'
  };

  render(){

    return(
      <TouchableOpacity onPress={this.props.onPress}>
      <View style={[styles.button, {backgroundColor: 'rgba(0, 0, 0, 0)'}]}>
      <Text style={{alignSelf: 'center', fontSize: this.props.fontSize, textDecorationLine:'underline', color: this.props.textColor}}>{this.props.text}</Text>
      </View>
      </TouchableOpacity>

    );
  }

}
