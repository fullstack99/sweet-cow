import React, { Component } from 'react';
import { View, Text, TextInput, Dimensions, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;



const styles = StyleSheet.create({
  overlayView: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 1.0,
    backgroundColor: 'rgba(100, 100, 100, 0.6)',
    width: deviceWidth,
    height: deviceHeight
  },
  activityIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    marginTop: deviceHeight * 0.5 - 40
  }

});

export default class Loading extends Component{

  static propTypes = {
    isLoading: React.PropTypes.bool
  }


  // Specifies the default values for props:
  static defaultProps = {
    isLoading: false
  };

  render(){

    if(this.props.isLoading == true){
      return(
        <View style={styles.overlayView}>
        <ActivityIndicator
        animating={true}
        style={styles.activityIndicator}
        size="large"
        color= "#fff"
        />
        </View>
      )
    }
    else{
      return <View/>
    }

  }

}
