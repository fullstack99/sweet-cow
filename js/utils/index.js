import { Linking } from 'react-native';

export function openExternalMaps(location, lastPosition) {
  var destination = location
  destination = destination.replace(/\s/g, "+");
  let url = 'comgooglemaps://?saddr=' + lastPosition.coords.latitude + ',' + lastPosition.coords.longitude + '&daddr=' + destination + '&directionsmode=drive'

  Linking.canOpenURL(url).then(supported => {
    if (!supported) {
      url = 'http://maps.apple.com/?saddr=sll=' + lastPosition.coords.latitude + ',' + lastPosition.coords.longitude + '&daddr=' + destination + '&dirflg=r'
      return Linking.openURL(url);
    } else {
      return Linking.openURL(url);
    }
  }).catch(err => console.error('An error occurred', err));
}

export function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
}
