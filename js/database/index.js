import * as firebase from "firebase";

class Database {

  /**
  * Sets a users mobile number
  * @param userId
  * @param mobile
  * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
  */
  static setUserData(userId, email, name) {
    let userDataPath = "/user/" + userId + "/details";
    return firebase.database().ref(userDataPath).set({
      email: email,
      name: name
    })
  }

  static setHomeLocation(userId, details) {
    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    updates['/user/' + userId + '/details/locationId'] = details;
    return firebase.database().ref().update(updates)
  }


  static setFavorites(userId, details) {
    // Write the new post's data simultaneously in the posts list and the user's post list.
    let userDataPath = "/user/" + userId + "/details/favorites";
    var ref = firebase.database().ref(userDataPath).push(details)
    return ref.key
  }

  static setFavoritesCount(details, value) {
    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    updates["/flavours/" + details.flavorName + '_' + details.shopId + "/count"] = value;
    return firebase.database().ref().update(updates)
  }

  static getFavoritesCount(details, callback) {
    let userDataPath = "/flavours/"+details.flavorName+'_'+details.shopId+"/";
    firebase.database().ref(userDataPath).once('value', (snapshot) => {
      var data = {};
      if(snapshot.val() === null || snapshot.val().count === undefined){
          data = {count:0}
      }else{
        data = {count:snapshot.val().count}
      }

      callback(data)
  });

    // Write the new post's data simultaneously in the posts list and the user's post list.
    // return firebase.database().ref().update(updates)
  }



  static removeFavorites(userId, details) {
    // Write the new post's data simultaneously in the posts list and the user's post list.
    let userDataPath = "/user/" + userId + "/details/favorites/"+details.key;
    return firebase.database().ref(userDataPath).remove()
  }

  /**
  * Listen for changes to a users mobile number
  * @param userId
  * @param callback Users mobile number
  */

  static listenUserData(userId, callback) {
    let userDataPath = "/user/" + userId + "/details";
    this.userdataListener = firebase.database().ref(userDataPath).once('value', (snapshot) => {
      var data = {};
      if (snapshot.val()) {
        let favoritesArray = []          // get children as an array
        if(snapshot.val().favorites!==undefined){
          let flavours = JSON.parse(JSON.stringify(snapshot.val().favorites))
          Object.keys(flavours).forEach((key)=>{
            let element = {key:key, flavorName:flavours[key].flavorName, shopId:flavours[key].shopId}
            favoritesArray.push(element);
          })
        }
        data = {uid:userId, email:snapshot.val().email, name: snapshot.val().name, locationId:snapshot.val().locationId, favorites:favoritesArray}
      }
      callback(data)
    });
    return this.userdataListener
  }
}

module.exports = Database;
