import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  AsyncStorage,
  StatusBar,
  NetInfo,
  Alert
} from "react-native";
import Expo from "expo";
import MainStore from "./src/Store/MainStore";
import MainStackRouter from "./src/components/Router/MainStackRouter";
import * as firebase from "firebase";
import Details from "./src/components/Events/Details.js";
var firebaseConfig = {
  apiKey: "AIzaSyAgxIEmgg-WomWOFMaKZH0k38ouGeZMdx4",
  authDomain: "rnblrapp.firebaseapp.com",
  databaseURL: "https://rnblrapp.firebaseio.com",
  projectId: "rnblrapp",
  storageBucket: "rnblrapp.appspot.com",
  messagingSenderId: "269780639340"
};
firebase.initializeApp(firebaseConfig);
const { width, height } = Dimensions.get("window");

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
        Alert.alert("Error", "check internet connection");
      }
    });
    try {
      const value = await AsyncStorage.getItem("@UserLogin");
      if (value !== null) {
        // We have data!!
        console.log(JSON.parse(value));
        MainStore.setUserLoginState(JSON.parse(value));
      }
    } catch (error) {
      // Error retrieving data
      console.log(error);
    }
  }
  async componentWillMount() {
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("native-base/Fonts/Ionicons.ttf")
    });
    this.setState({ isReady: true });
    MainStore.refreshAllData();
  }
  render() {
    if (!this.state.isReady) {
      return <Expo.AppLoading />;
    }
    return <MainStackRouter />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
