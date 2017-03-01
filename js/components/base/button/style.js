
const React = require('react-native');

const { StyleSheet, Dimensions } = React;
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

module.exports = StyleSheet.create({
  button: {
    borderWidth: 2,
    borderColor: 'white',
    height: 50,
    alignSelf: 'center',
    justifyContent: 'center'
  },

});
