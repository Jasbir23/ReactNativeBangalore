import React from "react";
import { View, NetInfo, Alert, AsyncStorage } from "react-native";
import { Spinner } from "native-base";
import Expo from "expo";
import MainStore from "./src/Store/MainStore";
import MainStackRouter from "./src/components/Router/MainStackRouter";
import * as firebase from "firebase";
var firebaseConfig = {
  apiKey: "AIzaSyAgxIEmgg-WomWOFMaKZH0k38ouGeZMdx4",
  authDomain: "rnblrapp.firebaseapp.com",
  databaseURL: "https://rnblrapp.firebaseio.com",
  projectId: "rnblrapp",
  storageBucket: "rnblrapp.appspot.com",
  messagingSenderId: "269780639340"
};
firebase.initializeApp(firebaseConfig);

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isReady: false
    };
  }
  async componentDidMount() {
    NetInfo.addEventListener("connectionChange", info => {
      if (info === "none") {
        Alert.alert(
          "Oops",
          "there seems to be a problem with your internet connection"
        );
      }
    });
    try {
      const value = await AsyncStorage.getItem("@rnblrappUser");
      if (value !== null) {
        MainStore.setUserLoginState(JSON.parse(value));
      }
    } catch (error) {}
  }
  async componentWillMount() {
    MainStore.refreshAllData();
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("native-base/Fonts/Ionicons.ttf")
    });
    this.setState({ isReady: true });
  }
  render() {
    if (!this.state.isReady) {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: "rgb(60,67,79)",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Spinner color="white" />
        </View>
      );
    }
    return <MainStackRouter />;
  }
}
