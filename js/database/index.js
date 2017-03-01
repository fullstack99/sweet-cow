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

    /**
     * Listen for changes to a users mobile number
     * @param userId
     * @param callback Users mobile number
     */
    static listenUserData(userId, callback) {

        let userDataPath = "/user/" + userId + "/details";


        firebase.database().ref(userDataPath).on('value', (snapshot) => {

            var data = {};

            if (snapshot.val()) {
              data = {email:snapshot.val().email, name: snapshot.val().name}
            }

            callback(data)
        });
    }

}

module.exports = Database;
