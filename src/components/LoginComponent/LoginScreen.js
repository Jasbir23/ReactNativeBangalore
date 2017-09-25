import React, { Component } from "react";
import { AsyncStorage } from "react-native";
import Exponent from "expo";
import { NavigationActions } from "react-navigation";
import { observer } from "mobx-react/native";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { Spinner, Icon } from "native-base";
import * as firebase from "firebase";
import MainStore from "../../Store/MainStore";
import { Permissions, Notifications } from "expo";

@observer
export default class LoginComponent extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: null
  });
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      currentUserName: undefined,
      looper: new Animated.Value(0)
    };
  }
  async getNotificationsPermission() {
    const { existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      return;
    }
    let token = await Notifications.getExpoPushTokenAsync();
    firebase
      .database()
      .ref("Users/" + MainStore.currentUserId + "/notificationKey/")
      .set({
        value: token
      });
  }
  async componentDidMount() {
    this.animationLoop();
    if ((await MainStore.userLoginState) !== undefined) {
      MainStore.setCurrentUserId(MainStore.userLoginState.id);
      this.setState({
        isFetching: false
      });
      this.getNotificationsPermission();
      this.props.navigation.dispatch(
        NavigationActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: "EventsPage" })]
        })
      );
    }
  }
  async saveUser() {
    const obj = {
      name: this.state.loginResponse.name,
      id: this.state.loginResponse.id
    };
    try {
      await AsyncStorage.setItem("@rnblrappUser", JSON.stringify(obj));
    } catch (error) {}
  }

  async logIn() {
    this.setState({
      isFetching: true
    });
    const {
      type,
      token
    } = await Exponent.Facebook.logInWithReadPermissionsAsync(
      "1629052627160543",
      {
        permissions: ["public_profile", "email"]
      }
    );
    if (type !== "success") {
      this.setState({
        isFetching: false
      });
      this.animationLoop();
    }
    if (type === "success") {
      const found = false;
      const response = await fetch(
        `https://graph.facebook.com/me?fields=name,id,age_range,link,gender,picture,cover,first_name,email&access_token=${token}`
      );
      const obj = await response.json();
      this.setState({
        loginResponse: obj
      });
      console.log(this.state.loginResponse);
      Object.keys(MainStore.allUsers).map((item, index) => {
        if (item === this.state.loginResponse.id) {
          found = true;
          MainStore.setCurrentUserId(item);
          this.saveUser();
          this.setState({
            isFetching: false
          });
          console.log("Existing Login");
          this.getNotificationsPermission();
          this.props.navigation.dispatch(
            NavigationActions.reset({
              index: 0,
              actions: [NavigationActions.navigate({ routeName: "EventsPage" })]
            })
          );
        }
      });
      if (found === false) {
        console.log("New Login");
        firebase
          .database()
          .ref("Users/" + this.state.loginResponse.id)
          .set({
            name:
              this.state.loginResponse.name === undefined
                ? 0
                : this.state.loginResponse.name,
            id:
              this.state.loginResponse.id === undefined
                ? 0
                : this.state.loginResponse.id,
            age_range:
              this.state.loginResponse.age_range === undefined
                ? 0
                : this.state.loginResponse.age_range,
            link:
              this.state.loginResponse.link === undefined
                ? 0
                : this.state.loginResponse.link,
            gender:
              this.state.loginResponse.gender === undefined
                ? 0
                : this.state.loginResponse.gender,
            picture:
              this.state.loginResponse.picture === undefined
                ? 0
                : this.state.loginResponse.picture,
            cover:
              this.state.loginResponse.cover === undefined
                ? 0
                : this.state.loginResponse.cover,
            first_name:
              this.state.loginResponse.first_name === undefined
                ? 0
                : this.state.loginResponse.first_name,
            email:
              this.state.loginResponse.email === undefined
                ? 0
                : this.state.loginResponse.email
          });
        MainStore.setCurrentUserId(this.state.loginResponse.id);
        this.saveUser();
        this.setState({
          isFetching: false
        });
        this.getNotificationsPermission();
        this.props.navigation.dispatch(
          NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: "EventsPage" })]
          })
        );
      }
    }
  }

  animationLoop() {
    this.state.looper.setValue(0);
    Animated.timing(this.state.looper, {
      toValue: 100,
      duration: 2000,
      useNativeDriver: true
    }).start(o => {
      if (o.finished) {
        this.animationLoop();
      }
    });
  }

  render() {
    const heart = this.state.looper.interpolate({
      inputRange: [0, 50, 100],
      outputRange: [1, 1.2, 1]
    });
    const heartY = this.state.looper.interpolate({
      inputRange: [0, 50, 100],
      outputRange: [0, 20, 0]
    });
    if (
      MainStore.allUsers === undefined ||
      MainStore.allEvents === undefined ||
      this.state.isFetching
    ) {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: "rgb(60, 67, 79)",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Spinner color="white" />
        </View>
      );
    }
    return (
      <View style={{ flex: 1, backgroundColor: "rgb(60, 67, 79)" }}>
        <View style={{ flex: 2, paddingTop: 60, paddingHorizontal: 20 }}>
          <Text
            style={{
              fontSize: 25,
              fontWeight: "bold",
              color: "white",
              textAlign: "center"
            }}
          >
            REACT NATIVE BANGALORE
          </Text>
        </View>
        <View
          style={{
            flex: 5,
            justifyContent: "flex-start",
            alignItems: "center",
            flexDirection: "column"
          }}
        >
          <Animated.View>
            <TouchableOpacity
              style={{
                height: 250,
                width: 250,
                borderRadius: 125,
                backgroundColor: "rgb(46, 86, 150)",
                justifyContent: "center",
                alignItems: "center",
                transform: [{ scale: heart }]
              }}
              onPress={() => this.logIn()}
            >
              <Icon
                name={"logo-facebook"}
                style={{ fontSize: 150, color: "white", fontWeight: "bold" }}
              />
            </TouchableOpacity>
          </Animated.View>
          <Animated.View style={{ transform: [{ translateY: heartY }] }}>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "bold",
                color: "white",
                textAlign: "center",
                marginVertical: 40
              }}
            >
              Continue with Facebook
            </Text>
          </Animated.View>
        </View>
      </View>
    );
  }
}
