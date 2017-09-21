import { observable } from "mobx";
import { Alert } from "react-native";
import * as firebase from "firebase";

class MainStore {
  @observable allUsers = undefined;
  @observable allEvents = undefined;
  @observable currentEventId = {};
  @observable currentUserId = {};
  @observable userLoginState = undefined;

  setUserLoginState(state) {
    this.userLoginState = state;
  }

  setCurrentEventId(eveId) {
    this.currentEventId = eveId;
  }
  setCurrentUserId(user) {
    this.currentUserId = user;
  }
  setAllEvents(events) {
    this.allEvents = events;
  }
  setAllUsers(users) {
    this.allUsers = users;
  }
  refreshAllData() {
    firebase.database().ref("Users/").once("value", snapshot => {
      if (snapshot !== undefined) {
        this.setAllUsers(snapshot.val());
      }
    });
    firebase.database().ref("Events/").once("value", snapshot => {
      if (snapshot !== undefined) {
        this.setAllEvents(snapshot.val());
      }
    });
  }
}
export default new MainStore();
