import React, { Component } from 'react';
import { View, Text, TextInput, Dimensions, TouchableOpacity, ActivityIndicator, StyleSheet, Image, Animated, Easing } from 'react-native';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;



const styles = StyleSheet.create({
  overlayView: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 1.0,
    width: deviceWidth,
    height: deviceHeight
  },
  backgroundImage: {
    width: deviceWidth,
    height: deviceHeight,
    resizeMode: 'contain',
    zIndex: 99
  },
  activityIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    marginTop: deviceHeight * 0.5 - 40
  },
  overlayViewBottom: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    opacity: 1.0,
    backgroundColor: '#ffffff',
    width: deviceWidth,
    height: 100,
    zIndex: 1
  }

});

const background = require('../../../../images/sweet-cow-loading-screen.png');
const loading_Circle = require('../../../../images/loading_circle.png');


export default class Loading extends Component {

  static propTypes = {
    isLoading: React.PropTypes.bool
  }


  // Specifies the default values for props:
  static defaultProps = {
    isLoading: false
  };

  constructor(props) {
    super(props);
    this.spinValue = new Animated.Value(0)
    this.state = {
      pecentage: 60,
      backgroundColor: '#ffffff',
      backgroundColorBottom: '#ffffff',
      backgroundColorText: '#ffffff'
    };
  }

  spin() {
    this.spinValue.setValue(0)
    Animated.timing(
      this.spinValue,
      {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear
      }
    ).start(() => this.spin())
  }

  startPercentageIncrease() {
    this.timer = setInterval(() => {
      this.increasePecentage()
    }, 200);
  }

  increasePecentage() {
    var percentage = this.state.pecentage
    percentage += Math.floor(Math.random() * (10 - 1)) + 1

    if (percentage <= 100) {
      this.setState({ pecentage: percentage })
    }
  }

  componentDidMount() {
    this.spin()
    this.startPercentageIncrease()
    setTimeout(() => {
      this.setState({
        backgroundColor: '#B9CFF4',
        backgroundColorBottom: '#6787B8',
        backgroundColorText: '#708EC0'
      })
    }, 100)
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  render() {

    var percentageFormatted = this.state.pecentage + '%'
    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    })

    if (this.props.isLoading == true) {
      return (
        <View style={[styles.overlayView, { backgroundColor : this.state.backgroundColor}]}>
          <Image source={background} style={styles.backgroundImage}>
            <Animated.Image
              style={{
                marginTop: deviceHeight * 0.7,
                alignSelf: 'center',
                resizeMode: 'contain',
                width: 60,
                height: 60,
                transform: [{ rotate: spin }]
              }}
              source={loading_Circle}
            >
            </Animated.Image>
            <Text style={{
              marginTop: -38, fontSize: 10,
              alignSelf: 'center', color: 'white',
              backgroundColor: this.state.backgroundColorText
            }}> {percentageFormatted}</Text>
          </Image>
          <View style={[styles.overlayViewBottom, { backgroundColor : this.state.backgroundColorBottom}]}/>
        </View>
      )
    }
    else {
      return <View />
    }

  }

}
