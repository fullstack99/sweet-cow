import React, { Component } from 'react';
import { View, Text, TextInput, Dimensions, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import SearchScreen from './index'

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;



const styles = StyleSheet.create({
  overlayView: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 1.0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
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

export default class SearchResults extends Component{

  static propTypes = {
    isSearchMode: React.PropTypes.bool
  }


  // Specifies the default values for props:
  static defaultProps = {
    isSearchMode: false
  };

  render(){

    if(this.props.isSearchMode == true){
      return(
        <View style={styles.overlayView}>
          <SearchScreen distanceArray={this.props.distanceArray} lastPosition={this.props.lastPosition} crossAction={this.props.crossAction}/>
        </View>
      )
    }
    else{
      return null
    }

  }

}
