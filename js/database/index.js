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


        let userDataPath = "/user/" + userId + "/details";

        return firebase.database().ref().update(updates)

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

              data = {uid:userId, email:snapshot.val().email, name: snapshot.val().name, locationId:snapshot.val().locationId}
            }

            callback(data)
        });

        return this.userdataListener
    }

}

module.exports = Database;
