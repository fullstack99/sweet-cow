import React, { Component } from 'react';
import { View, Text, TextInput, Dimensions, TouchableOpacity } from 'react-native';
import { Item, Icon, Input } from 'native-base';

const deviceWidth = Dimensions.get('window').width;


export default class Pulse extends Component{


  constructor(props) {
    super(props);
    this.state = {
    alpha: 1,
    radius:0
  };
}


  componentDidMount(){
    this.startFaddingCircle()
  }

  componentWillUnmount(){
    clearInterval(this.timer)
  }

  startFaddingCircle(){
    this.timer = setInterval(() => {
      this.fadingCircleRadius()
    }, 100);
  }

  fadingCircleRadius(){
    var  radius = this.state.radius
    radius += 5
    var  alpha = this.state.alpha
    alpha -= 0.05
    if(radius >= 100){
      radius = 0
      alpha = 1
    }
    this.setState({radius: radius, alpha:alpha})


  }



  render(){

    var alpha = this.state.alpha
    var radius = this.state.radius
    let color = 'rgba(92,133,192,' + alpha +')'
    var offset = (100 - radius)/2

    return(
      <View accessible={false} pointerEvents="none" style={{width: 100, height: 100, justifyContent:'center'}}>
      <View accessible={false} style={{backgroundColor:color, height:radius,width:radius, borderRadius:radius/2, justifyContent:'center', alignSelf: "center" }}>
      <View accessible={false} style={{height:10 , width: 10, backgroundColor:'rgba(92,133,192,1)', borderRadius:5, alignSelf: 'center'}}>
      </View>
      </View>
      </View>

    );
  }

}
