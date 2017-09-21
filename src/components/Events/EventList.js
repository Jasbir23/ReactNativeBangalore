import React, { Component } from "react";
import HelixScroll from "../../Helix/HelixScroll";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  Dimensions,
  StatusBar,
  Platform,
  Animated
} from "react-native";
import { Icon, Spinner } from "native-base";
const { width, height } = Dimensions.get("window");
import * as firebase from "firebase";
import { observer } from "mobx-react/native";
import MainStore from "../../Store/MainStore";

@observer
export default class EventList extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: null
  });
  constructor(props) {
    super(props);
    this.state = {
      events: undefined,
      profileAni: new Animated.Value(0)
    };
  }
  momentumEnd(e) {
    this.setState({
      currentScrollPointer: e.nativeEvent.contentOffset.y
    });
  }
  render() {
    const shiver = this.state.profileAni.interpolate({
      inputRange: [0, 25, 50, 75, 100],
      outputRange: [0, 40, 0, 10, 0]
    });
    const proZo = this.state.profileAni.interpolate({
      inputRange: [0, 25, 50, 75, 100],
      outputRange: [1, 1.2, 1, 1.1, 1]
    });
    if (MainStore.allEvents === undefined) {
      return <Spinner />;
    }
    return (
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />
        <HelixScroll
          stick={true}
          itemCount={Object.keys(MainStore.allEvents).length}
          contentContainerStyle={{
            backgroundColor: "rgb(60, 67, 79)"
          }}
          shiver={() => {
            this.state.profileAni.setValue(0);
            Animated.timing(this.state.profileAni, {
              toValue: 100,
              duration: 700,
              useNativeDriver: true
            }).start();
          }}
          renderCard={index => {
            return this.renderCard(index);
          }}
        />
        <Animated.View
          style={{
            position: "absolute",
            justifyContent: "center",
            alignItems: "center",
            top: 40,
            left: width - 80,
            flexDirection: "column",
            transform: [{ translateY: shiver }, { scale: proZo }]
          }}
        >
          <TouchableOpacity
            style={{
              height: 50,
              width: 50,
              borderRadius: 25,
              backgroundColor: "rgb(46, 86, 150)",
              justifyContent: "center",
              alignItems: "center"
            }}
            onPress={() => this.props.navigation.navigate("ProfileScreen")}
          >
            <Icon name="person" active={true} style={{ color: "white" }} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "bold",
              color: "white",
              backgroundColor: "transparent",
              marginVertical: 8
            }}
          >
            Profile
          </Text>
        </Animated.View>
        <View
          style={{
            position: "absolute",
            top: height - 60,
            height: 40,
            alignSelf: "center",
            justifyContent: "flex-start",
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <Icon
            name="code"
            style={{
              backgroundColor: "transparent",
              color: "white",
              transform: [{ rotate: "90deg" }]
            }}
          />
          <Text
            style={{
              backgroundColor: "transparent",
              paddingHorizontal: 10,
              fontWeight: "bold",
              fontSize: 12,
              color: "white"
            }}
          >
            Swipe Up/Down
          </Text>
        </View>
      </View>
    );
  }
  requested(eve) {
    console.log("requested", eve);
    firebase
      .database()
      .ref("Users/" + MainStore.currentUserId + "/eventRequest/" + eve.id)
      .set({
        status: "requested"
      });
    firebase
      .database()
      .ref("Events/" + eve.id + "/receivedRequests/" + MainStore.currentUserId)
      .set({
        status: "requested"
      });
    MainStore.refreshAllData();
  }
  getUserStatus(eve) {
    let userStatus = undefined;
    if (eve.receivedRequests === undefined) {
      userStatus = "request";
    } else if (eve.receivedRequests !== undefined) {
      Object.keys(eve.receivedRequests).map((item, index) => {
        if (item === MainStore.currentUserId) {
          userStatus = eve.receivedRequests[item].status;
        }
      });
      if (userStatus === undefined) {
        userStatus = "request";
      }
    }
    if (eve.isPast) {
      return (
        <View
          style={{
            height: 60,
            width: 160,
            borderRadius: 10
          }}
        />
      );
    } else if (!eve.isPast) {
      if (eve.isHouseful) {
        return (
          <View
            style={{
              height: 60,
              width: 160,
              backgroundColor: "grey",
              borderRadius: 10,
              top: 340,
              transform: [{ translateY: -90 }]
            }}
          >
            <TouchableOpacity
              style={{
                height: 60,
                width: 160,
                borderRadius: 10,
                backgroundColor: "rgba(0,0,0,0.2)",
                justifyContent: "center",
                alignItems: "center"
              }}
              disabled={true}
            >
              <Text
                style={{
                  fontSize: 12,
                  top: 3,
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "white"
                }}
              >
                House Full
              </Text>
            </TouchableOpacity>
          </View>
        );
      } else if (!eve.isHouseful) {
        switch (userStatus) {
          case "request":
            return (
              <View
                style={{
                  height: 60,
                  width: 160,
                  backgroundColor: "rgb(247, 27, 129)",
                  borderRadius: 10,
                  top: 340,
                  transform: [{ translateY: -90 }]
                }}
              >
                <TouchableOpacity
                  style={{
                    height: 60,
                    width: 160,
                    borderRadius: 10,
                    backgroundColor: "rgba(0,0,0,0.2)",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                  onPress={() => {
                    this.requested(eve);
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      top: 3,
                      fontWeight: "bold",
                      textAlign: "center",
                      color: "white"
                    }}
                  >
                    REQUEST
                  </Text>
                </TouchableOpacity>
              </View>
            );

            break;
          case "requested":
            return (
              <View
                style={{
                  height: 60,
                  width: 160,
                  backgroundColor: "pink",
                  borderRadius: 10,
                  top: 340,
                  transform: [{ translateY: -90 }]
                }}
              >
                <TouchableOpacity
                  style={{
                    height: 60,
                    width: 160,
                    borderRadius: 10,
                    backgroundColor: "rgba(0,0,0,0.2)",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                  disabled={true}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      top: 3,
                      fontWeight: "bold",
                      textAlign: "center",
                      color: "white"
                    }}
                  >
                    REQUESTED
                  </Text>
                </TouchableOpacity>
              </View>
            );

            break;
          case "attending":
            return (
              <View
                style={{
                  height: 60,
                  width: 160,
                  backgroundColor: "pink",
                  borderRadius: 10,
                  top: 340,
                  transform: [{ translateY: -90 }]
                }}
              >
                <TouchableOpacity
                  style={{
                    height: 60,
                    width: 160,
                    borderRadius: 10,
                    backgroundColor: "rgba(0,0,0,0.2)",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                  disabled={true}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      top: 3,
                      fontWeight: "bold",
                      textAlign: "center",
                      color: "white"
                    }}
                  >
                    ATTENDING
                  </Text>
                </TouchableOpacity>
              </View>
            );

            break;
          case "denied":
            return (
              <View
                style={{
                  height: 60,
                  width: 160,
                  backgroundColor: "grey",
                  borderRadius: 10,
                  top: 340,
                  transform: [{ translateY: -90 }]
                }}
              >
                <TouchableOpacity
                  style={{
                    height: 60,
                    width: 160,
                    borderRadius: 10,
                    backgroundColor: "rgba(0,0,0,0.2)",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                  disabled={true}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      top: 3,
                      fontWeight: "bold",
                      textAlign: "center",
                      color: "white"
                    }}
                  >
                    House Full
                  </Text>
                </TouchableOpacity>
              </View>
            );

            break;
          default:
            return (
              <View
                style={{
                  height: 60,
                  width: 160,
                  backgroundColor: "rgb(247, 27, 129)",
                  borderRadius: 10,
                  top: 340,
                  transform: [{ translateY: -90 }]
                }}
              >
                <TouchableOpacity
                  style={{
                    height: 60,
                    width: 160,
                    borderRadius: 10,
                    backgroundColor: "rgba(0,0,0,0.2)",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                  onPress={() => {
                    this.requested(eve);
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      top: 3,
                      fontWeight: "bold",
                      textAlign: "center",
                      color: "white"
                    }}
                  >
                    REQUEST
                  </Text>
                </TouchableOpacity>
              </View>
            );
        }
      }
    }
  }
  renderCard(index) {
    const obj = Object.keys(MainStore.allEvents);
    const eve = MainStore.allEvents[obj[index]];
    // console.log(eve);
    return (
      <View
        style={{
          width: width - 40,
          height: 300,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        {this.getUserStatus(eve)}
        <View
          style={{
            height: 60,
            width: 200,
            backgroundColor: "rgb(247, 239, 240)",
            borderRadius: 10,
            top: 230,
            transform: [{ translateY: -90 }],
            flexDirection: "row"
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column"
            }}
          >
            <Text
              style={{
                fontSize: 15,
                top: 3,
                fontWeight: "bold",
                textAlign: "center"
              }}
            >
              {eve.likes === undefined ? 0 : Object.keys(eve.likes).length}
            </Text>
            <Text
              style={{
                fontSize: 10,
                top: 3,
                textAlign: "center",
                color: "grey"
              }}
            >
              likes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column"
            }}
          >
            <Text
              style={{
                fontSize: 15,
                top: 3,
                fontWeight: "bold",
                textAlign: "center"
              }}
            >
              {eve.nextComment.index === undefined ? 0 : eve.nextComment.index}
            </Text>
            <Text
              style={{
                fontSize: 10,
                top: 3,
                textAlign: "center",
                color: "grey"
              }}
            >
              comments
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column"
            }}
          >
            <Text
              style={{
                fontSize: 15,
                top: 3,
                fontWeight: "bold",
                textAlign: "center"
              }}
            >
              {eve.attended}
            </Text>
            <Text
              style={{
                fontSize: 10,
                top: 3,
                textAlign: "center",
                color: "grey"
              }}
            >
              attendees
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            height: 200,
            width: 300,
            borderRadius: 10,
            backgroundColor: "black",
            top: 0,
            transform: [{ translateY: -110 }],
            overflow: "hidden"
          }}
        >
          <Image
            style={{
              height: 200,
              width: 300,
              position: "absolute",
              top: 0
            }}
            borderRadius={10}
            source={{
              uri: eve.coverPic
            }}
          >
            <TouchableOpacity
              style={{
                height: 200,
                width: 300,
                borderRadius: 10,
                justifyContent: "flex-end",
                flexDirection: "column",
                justifyContent: "flex-end",
                flexDirection: "column",
                backgroundColor: "rgba(0,0,0,0.1)"
              }}
              onPress={() => {
                MainStore.setCurrentEventId(eve.id);
                this.props.navigation.navigate("EventDetails");
              }}
            >
              <View
                style={{
                  height: 60,
                  width: 300,
                  backgroundColor: "rgba(0,0,0,0.4)",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  borderRadius: 10
                }}
              >
                <View
                  style={{
                    height: 30,
                    width: 300,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "bold",
                      color: "white",
                      letterSpacing: 4,
                      top: 5,
                      textAlign: "center"
                    }}
                  >
                    {eve.name}
                  </Text>
                </View>
                <View
                  style={{
                    height: 30,
                    width: 300,
                    flexDirection: "row"
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      paddingLeft: 5
                    }}
                  >
                    <Icon
                      active={true}
                      name="calendar"
                      style={{
                        fontSize: 12,
                        color: "white",
                        marginHorizontal: 5
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 12,
                        top: 0,
                        color: "rgb(224, 224, 224)",
                        letterSpacing: 1
                      }}
                    >
                      {eve.date.mm + "," + eve.date.dd + " " + eve.date.yyyy}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1.3,
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center"
                    }}
                  >
                    <Icon
                      active={true}
                      name="pin"
                      style={{
                        fontSize: 12,
                        color: "white",
                        marginHorizontal: 5
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 12,
                        top: 0,
                        color: "rgb(224, 224, 224)",
                        letterSpacing: 1
                      }}
                    >
                      {eve.location}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </Image>
        </View>
      </View>
    );
  }
}
