
const React = require('react-native');

const { StyleSheet, Dimensions } = React;
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

module.exports = StyleSheet.create({
  textField: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderWidth: 2,
    borderColor: '#6b8ac3',
    height: 50,
    alignSelf: 'center',
    flexDirection: 'row'
  },

});
