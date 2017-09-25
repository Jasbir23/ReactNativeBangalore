import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  Dimensions,
  AsyncStorage,
  ScrollView
} from "react-native";
import { NavigationActions } from "react-navigation";
import {
  Spinner,
  Thumbnail,
  Text,
  Item,
  Input,
  Icon,
  Button
} from "native-base";
import * as firebase from "firebase";
import MainStore from "../../Store/MainStore";
import { observer } from "mobx-react/native";
import ProfileForm from "./ProfileForm";
const { width, height } = Dimensions.get("window");

@observer
export default class ProfileScreen extends Component {
  form = new ProfileForm();
  static navigationOptions = ({ navigation }) => ({
    header: null
  });
  constructor(props) {
    super(props);
    this.state = {
      userObj: undefined,
      errorMsg: "",
      hasChanged: false,
      submitted: false
    };
  }
  submitted() {
    this.setState({
      submitted: true
    });
    if (this.form.name !== "" && this.form.name !== undefined) {
      firebase
        .database()
        .ref("Users/" + MainStore.currentUserId + "/username")
        .set({
          val: this.form.name
        });
    }
    if (this.form.profession !== "" && this.form.profession !== undefined) {
      firebase
        .database()
        .ref("Users/" + MainStore.currentUserId + "/profession")
        .set({
          val: this.form.profession
        });
    }
    if (this.form.email !== "" && this.form.email !== undefined) {
      firebase
        .database()
        .ref("Users/" + MainStore.currentUserId + "/email")
        .set({
          val: this.form.email
        });
    }
    if (this.form.experience !== "" && this.form.experience !== undefined) {
      firebase
        .database()
        .ref("Users/" + MainStore.currentUserId + "/experience")
        .set({
          val: this.form.experience
        });
    }
    if (this.form.bio !== "" && this.form.bio !== undefined) {
      firebase
        .database()
        .ref("Users/" + MainStore.currentUserId + "/bio")
        .set({
          val: this.form.bio
        });
    }
    if (this.form.city !== "" && this.form.city !== undefined) {
      firebase
        .database()
        .ref("Users/" + MainStore.currentUserId + "/city")
        .set({
          val: this.form.city
        });
    }
    firebase
      .database()
      .ref("Users/")
      .once("value", snapshot => {
        MainStore.setAllUsers(snapshot.val());
        this.props.navigation.goBack();
      });
  }
  componentWillMount() {
    firebase
      .database()
      .ref("Users/" + MainStore.currentUserId + "/")
      .once("value", snapshot => {
        this.setState({
          userObj: snapshot.val()
        });
      });
  }
  render() {
    if (this.state.userObj === undefined) {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: "rgb(60,67,79)",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Spinner />
        </View>
      );
    }
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "flex-start",
          alignItems: "center",
          flexDirection: "column"
        }}
      >
        <View
          style={{
            height: 180,
            width: width,
            backgroundColor: "rgb(60, 67, 79)",
            alignSelf: "stretch",
            flexDirection: "row"
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              paddingTop: 25,
              paddingLeft: 15,
              justifyContent: "flex-start"
            }}
          >
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" style={{ color: "rgb(22, 251, 255)" }} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 3,
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start"
            }}
          >
            <Thumbnail
              style={{ marginTop: 35 }}
              source={{
                uri:
                  this.state.userObj.picture !== undefined
                    ? this.state.userObj.picture.data.url
                    : "https://raw.githubusercontent.com/Jasbir23/RNBangalore-Store/master/assets/propic/user.png"
              }}
            />
            <Text
              style={{
                marginTop: 15,
                color: "white",
                fontWeight: "bold"
              }}
            >
              {this.state.userObj.name}
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                width: "100%",
                marginVertical: 15,
                paddingHorizontal: 5,
                backgroundColor: "transparent",
                alignItems: "center"
              }}
            >
              <Icon
                name="bug"
                active
                style={{
                  fontSize: 15,
                  marginHorizontal: 5,
                  color:
                    this.state.errorMsg === ""
                      ? "transparent"
                      : "rgb(22, 251, 255)"
                }}
              />
              <Text
                style={{
                  fontSize: 14,
                  color: "rgb(22, 251, 255)",
                  backgroundColor: "transparent",
                  width: "100%"
                }}
              >
                {this.state.errorMsg}
              </Text>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              paddingTop: 25,
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignItems: "center"
              }}
              onPress={() => {
                MainStore.setUserLoginState(undefined);
                AsyncStorage.removeItem("@rnblrappUser");
                this.props.navigation.dispatch(
                  NavigationActions.reset({
                    index: 0,
                    actions: [
                      NavigationActions.navigate({
                        routeName: "LoginComponent"
                      })
                    ]
                  })
                );
              }}
            >
              <Icon
                active
                name="power"
                style={{
                  color: "rgb(22, 251, 255)",
                  fontWeight: "bold",
                  fontSize: 25
                }}
              />
              <Text
                style={{
                  fontSize: 12,
                  color: "rgb(22, 251, 255)",
                  fontWeight: "bold"
                }}
              >
                logout
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView
          style={{ width: width, height: height - 180 }}
          contentContainerStyle={{
            flexDirection: "column",
            paddingRight: 8,
            justifyContent: "space-around",
            width: width
          }}
        >
          <View
            style={{
              flex: 1,
              marginVertical: 10,
              flexDirection: "row"
            }}
          >
            <View
              style={{
                flex: 0.4,

                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text>Name</Text>
            </View>
            <View
              style={{
                flex: 1,

                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Item
                rounded
                error={
                  this.form.validateErrorName !== undefined &&
                  this.form.name !== ""
                }
              >
                <Input
                  placeholder={
                    this.state.userObj.username !== undefined
                      ? this.state.userObj.username.val
                      : this.state.userObj.name
                  }
                  style={{ transform: [{ scale: 0.85 }] }}
                  onChangeText={val => {
                    if (val === "") {
                      this.setState({
                        hasChanged: false
                      });
                    } else if (val !== "") {
                      this.setState({
                        hasChanged: true
                      });
                    }
                    this.form.name = val;
                    this.setState({
                      errorMsg: this.form.validateErrorName
                        ? this.form.validateErrorName
                        : ""
                    });

                    if (this.form.name === "") {
                      this.setState({
                        errorMsg: ""
                      });
                    }
                  }}
                />
              </Item>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              marginVertical: 10,
              flexDirection: "row"
            }}
          >
            <View
              style={{
                flex: 0.4,

                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text>Profession</Text>
            </View>
            <View
              style={{
                flex: 1,

                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Item
                rounded
                error={
                  this.form.validateErrorProfession !== undefined &&
                  this.form.profession !== ""
                }
              >
                <Input
                  placeholder={
                    this.state.userObj.profession === undefined ||
                    this.state.userObj.profession === 0
                      ? "***"
                      : this.state.userObj.profession.val
                  }
                  style={{ transform: [{ scale: 0.85 }] }}
                  onChangeText={val => {
                    if (val === "") {
                      this.setState({
                        hasChanged: false
                      });
                    } else if (val !== "") {
                      this.setState({
                        hasChanged: true
                      });
                    }
                    this.form.profession = val;
                    this.setState({
                      errorMsg: this.form.validateErrorProfession
                        ? this.form.validateErrorProfession
                        : ""
                    });

                    if (this.form.profession === "") {
                      this.setState({
                        errorMsg: ""
                      });
                    }
                  }}
                />
              </Item>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              marginVertical: 10,
              flexDirection: "row"
            }}
          >
            <View
              style={{
                flex: 0.4,

                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text>Email</Text>
            </View>
            <View
              style={{
                flex: 1,

                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Item
                rounded
                error={
                  this.form.validateErrorEmail !== undefined &&
                  this.form.email !== ""
                }
              >
                <Input
                  placeholder={
                    this.state.userObj.email === undefined ||
                    this.state.userObj.email === 0
                      ? "***"
                      : this.state.userObj.email.val
                        ? this.state.userObj.email.val
                        : this.state.userObj.email
                  }
                  style={{ transform: [{ scale: 0.85 }] }}
                  onChangeText={val => {
                    if (val === "") {
                      this.setState({
                        hasChanged: false
                      });
                    } else if (val !== "") {
                      this.setState({
                        hasChanged: true
                      });
                    }
                    this.form.email = val;
                    this.setState({
                      errorMsg: this.form.validateErrorEmail
                        ? this.form.validateErrorEmail
                        : ""
                    });
                    if (this.form.email === "") {
                      this.setState({
                        errorMsg: ""
                      });
                    }
                  }}
                />
              </Item>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              marginVertical: 10,
              flexDirection: "row"
            }}
          >
            <View
              style={{
                flex: 0.4,

                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text>Exp(Yrs)</Text>
            </View>
            <View
              style={{
                flex: 1,

                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Item
                rounded
                error={
                  this.form.validateErrorExperience !== undefined &&
                  this.form.experience !== ""
                }
              >
                <Input
                  placeholder={
                    this.state.userObj.experience === undefined ||
                    this.state.userObj.experience === 0
                      ? "***"
                      : this.state.userObj.experience.val
                  }
                  style={{ transform: [{ scale: 0.85 }] }}
                  onChangeText={val => {
                    if (val === "") {
                      this.setState({
                        hasChanged: false
                      });
                    } else if (val !== "") {
                      this.setState({
                        hasChanged: true
                      });
                    }
                    this.form.experience = val;
                    this.setState({
                      errorMsg: this.form.validateErrorExperience
                        ? this.form.validateErrorExperience
                        : ""
                    });
                    if (this.form.experience === "") {
                      this.setState({
                        errorMsg: ""
                      });
                    }
                  }}
                />
              </Item>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              marginVertical: 10,
              flexDirection: "row"
            }}
          >
            <View
              style={{
                flex: 0.4,

                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text>Bio</Text>
            </View>
            <View
              style={{
                flex: 1,

                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Item
                rounded
                error={
                  this.form.validateErrorBio !== undefined &&
                  this.form.bio !== ""
                }
              >
                <Input
                  placeholder={
                    this.state.userObj.bio === undefined ||
                    this.state.userObj.bio === 0
                      ? "***"
                      : this.state.userObj.bio.val
                  }
                  style={{ transform: [{ scale: 0.85 }] }}
                  onChangeText={val => {
                    if (val === "") {
                      this.setState({
                        hasChanged: false
                      });
                    } else if (val !== "") {
                      this.setState({
                        hasChanged: true
                      });
                    }
                    this.form.bio = val;
                    this.setState({
                      errorMsg: this.form.validateErrorBio
                        ? this.form.validateErrorBio
                        : ""
                    });
                    if (this.form.bio === "") {
                      this.setState({
                        errorMsg: ""
                      });
                    }
                  }}
                />
              </Item>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              marginVertical: 10,
              flexDirection: "row"
            }}
          >
            <View
              style={{
                flex: 0.4,

                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text>City</Text>
            </View>
            <View
              style={{
                flex: 1,

                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Item
                rounded
                error={
                  this.form.validateErrorCity !== undefined &&
                  this.form.city !== ""
                }
              >
                <Input
                  placeholder={
                    this.state.userObj.city === undefined ||
                    this.state.userObj.city === 0
                      ? "***"
                      : this.state.userObj.city.val
                  }
                  style={{ transform: [{ scale: 0.85 }] }}
                  onChangeText={val => {
                    if (val === "") {
                      this.setState({
                        hasChanged: false
                      });
                    } else if (val !== "") {
                      this.setState({
                        hasChanged: true
                      });
                    }
                    this.form.city = val;
                    this.setState({
                      errorMsg: this.form.validateErrorCity
                        ? this.form.validateErrorCity
                        : ""
                    });
                    if (this.form.city === "") {
                      this.setState({
                        errorMsg: ""
                      });
                    }
                  }}
                />
              </Item>
            </View>
          </View>
          <View
            style={{
              flex: 1,

              flexDirection: "column",
              justifyContent: "flex-start",
              padding: 10,
              alignItems: "center"
            }}
          >
            <Button
              onPress={() => this.submitted()}
              disabled={
                this.state.errorMsg !== "" ||
                !this.state.hasChanged ||
                this.state.submitted
              }
              rounded
              primary={this.state.errorMsg === "" && this.state.hasChanged}
              style={{ alignSelf: "center" }}
            >
              <Text>{this.state.submitted ? "submitted" : "submit"}</Text>
            </Button>
          </View>
        </ScrollView>
      </View>
    );
  }
}
