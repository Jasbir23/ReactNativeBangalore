import React, { Component } from "react";
import {
  View,
  Image,
  WebView,
  Dimensions,
  Animated,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  Platform
} from "react-native";
import { Video } from "expo";
import {
  Container,
  Title,
  Body,
  Content,
  Header,
  Left,
  Right,
  Spinner,
  Text,
  Button,
  Icon,
  Item,
  Input,
  Card,
  CardItem,
  Thumbnail
} from "native-base";
const { width, height } = Dimensions.get("window");
import * as firebase from "firebase";
import { observer } from "mobx-react/native";
import MainStore from "../../Store/MainStore";

@observer
export default class Details extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: null
  });
  constructor(props) {
    super(props);
    this.state = {
      eve: undefined,
      user: undefined,
      com: new Animated.Value(0),
      commentOpen: false,
      liked: false,
      commentEntered: "",
      heart: new Animated.Value(0)
    };
  }
  componentDidMount() {
    this.jumpHeart();
  }
  commentSubmit(eve) {
    if (this.state.commentEntered !== "") {
      let index = 0;
      if (eve.comments === undefined) {
        index = 0;
      } else if (eve.comments !== undefined) {
        index = eve.nextComment.index;
      }
      let date = new Date();
      firebase
        .database()
        .ref("Events/" + MainStore.currentEventId + "/comments/" + index)
        .set({
          comment: this.state.commentEntered,
          user: MainStore.currentUserId,
          date: date.toString()
        });
      firebase
        .database()
        .ref("Events/" + MainStore.currentEventId + "/nextComment")
        .set({
          index: index + 1
        });
      MainStore.refreshAllData();
      this.setState({
        commentEntered: ""
      });
    }
    this.commentPressed();
  }
  componentWillMount() {
    this.setState({
      eve: MainStore.allEvents[MainStore.currentEventId]
    });
    this.getInitialStatus(MainStore.allEvents[MainStore.currentEventId]);
  }
  getInitialStatus(eventObj) {
    if (eventObj.likes === undefined) {
      this.setState({
        liked: false
      });
    } else if (eventObj.likes !== undefined) {
      const found = false;
      Object.keys(eventObj.likes).map((item, index) => {
        if (item === MainStore.currentUserId) {
          this.setState({
            liked: true
          });
          found = true;
        }
      });
      if (found === false) {
        this.setState({
          liked: false
        });
      }
    }
  }
  jumpHeart() {
    this.state.heart.setValue(0);
    Animated.timing(this.state.heart, {
      toValue: 100,
      duration: 500,
      useNativeDriver: true
    }).start();
  }
  commentPressed() {
    Animated.timing(this.state.com, {
      toValue: this.state.commentOpen ? 0 : 100,
      duration: 200,
      useNativeDriver: true
    }).start();
    this.setState({
      commentOpen: !this.state.commentOpen
    });
    this.jumpHeart();
  }
  renderComments() {
    if (MainStore.allEvents[MainStore.currentEventId].comments === undefined) {
      return (
        <View
          style={{
            width: 3 * width / 4 - 20,
            alignSelf: "center",
            height: 30,
            backgroundColor: this.state.scrolling
              ? "rgba(0,0,0,0.2)"
              : "transparent",
            marginVertical: 20,
            padding: 10,
            borderRadius: 5
          }}
        >
          <Text
            style={{
              flex: 1,
              fontSize: 10,
              fontWeight: "bold",
              color: "white"
            }}
          >
            no comments
          </Text>
        </View>
      );
    } else if (
      MainStore.allEvents[MainStore.currentEventId].comments !== undefined
    ) {
      return (
        <View style={{ height: "100%" }}>
          {MainStore.allEvents[
            MainStore.currentEventId
          ].comments.map((item, index) => {
            return (
              <View
                key={index}
                style={{
                  width: 3 * width / 4 - 20,
                  alignSelf: "center",
                  backgroundColor: this.state.scrolling
                    ? "rgba(0,0,0,0.2)"
                    : "transparent",
                  marginVertical: 10,
                  padding: 10,
                  borderRadius: 5,
                  flexDirection: "row",
                  paddingVertical: 20
                }}
              >
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    height: 1,
                    width: 3 * width / 4 - 20,
                    backgroundColor: this.state.scrolling
                      ? "transparent"
                      : "rgb(22, 251, 255)",
                    alignSelf: "center"
                  }}
                />
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 7
                  }}
                >
                  <Thumbnail
                    source={{
                      uri: MainStore.allUsers[
                        MainStore.allEvents[MainStore.currentEventId].comments[
                          index
                        ].user
                      ].picture.data.url
                    }}
                  />
                </View>
                <View
                  style={{
                    flex: 3,
                    flexDirection: "column",
                    padding: 7
                  }}
                >
                  <Text
                    style={{
                      width: "100%",
                      fontSize: 12,
                      fontWeight: "bold",
                      color: "rgb(22, 251, 255)",
                      alignSelf: "flex-start"
                    }}
                  >
                    {
                      MainStore.allUsers[
                        MainStore.allEvents[MainStore.currentEventId].comments[
                          index
                        ].user
                      ].name
                    }
                  </Text>
                  <Text
                    style={{
                      width: "100%",
                      fontSize: 12,
                      marginVertical: 7,
                      color: "white",
                      alignSelf: "flex-start"
                    }}
                  >
                    {
                      MainStore.allEvents[MainStore.currentEventId].comments[
                        index
                      ].comment
                    }
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                      width: "100%",
                      fontSize: 10,
                      color: "grey",
                      alignSelf: "flex-end"
                    }}
                  >
                    {MainStore.allEvents[MainStore.currentEventId].comments[
                      index
                    ].date.substring(4, 24)}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      );
    }
  }

  renderText(txt, index) {
    return (
      <View
        key={index}
        style={{
          padding: 10,
          marginVertical: 10
        }}
      >
        <Text>{txt.value}</Text>
      </View>
    );
  }
  renderImage(image, index) {
    return (
      <View
        key={index}
        style={{
          height: width * image.hfactor + 20,
          width: image.iscover ? width : width - 30,
          marginHorizontal: image.iscover ? 0 : 15,
          marginVertical: 10,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Spinner
          style={{
            position: "absolute",
            top: width * image.hfactor / 2 - 40,
            alignSelf: "center"
          }}
        />
        <Image
          source={{
            uri: image.value
          }}
          style={{
            height: width * image.hfactor,
            width: image.iscover ? width : width - 30,
            top: 0,
            borderWidth: image.iscover ? 0 : 1,
            borderColor: "rgb(60, 67, 79)",
            borderRadius: 4
          }}
        />
        <View
          style={{
            height: 20,
            width: width - 30,
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 20
          }}
        >
          <Text style={{ fontSize: 12, color: "grey" }}>{image.tag}</Text>
        </View>
      </View>
    );
  }
  renderVideo(video, index) {
    return (
      <View
        key={index}
        style={{
          marginVertical: 10,
          height: 160,
          width: 300,
          alignSelf: "center",
          marginHorizontal: 15
        }}
      >
        <Image
          style={{ height: 140, width: 300, borderRadius: 10 }}
          source={{
            uri: "https://i0.wp.com/digital-photography-school.com/wp-content/uploads/flickr/5661878892_15fba42846_o.jpg?resize=610&ssl=1"
          }}
        >
          <TouchableOpacity
            style={{
              height: 140,
              width: 300,
              backgroundColor: "rgba(0,0,0,0.3)",
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Icon
              name="logo-youtube"
              style={{ fontSize: 30, fontWeight: "bold", color: "white" }}
            />
          </TouchableOpacity>
        </Image>
        <View
          style={{
            height: 20,
            width: 300,
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 20
          }}
        >
          <Text style={{ fontSize: 12, color: "grey" }}>{video.tag}</Text>
        </View>
      </View>
    );
  }
  render() {
    var self = this;
    const movCom = this.state.com.interpolate({
      inputRange: [0, 100],
      outputRange: [width, 0]
    });
    const jumpHeart = this.state.heart.interpolate({
      inputRange: [0, 25, 50, 75, 100],
      outputRange: [0, -50, 0, -20, 0]
    });
    const scaleHeart = this.state.heart.interpolate({
      inputRange: [0, 25, 50, 75, 100],
      outputRange: [1, 1.4, 1, 1.2, 1]
    });
    if (MainStore.allEvents[MainStore.currentEventId] === undefined) {
      return <Spinner />;
    }
    return (
      <Container>
        <Header
          style={{
            backgroundColor: "rgb(60, 67, 79)",
            paddingTop: 12
          }}
        >
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon style={{ color: "rgb(22, 251, 255)" }} name="arrow-back" />
            </Button>
          </Left>
          <Body style={{ flex: 2.5 }}>
            <Title style={{ color: "white" }}>
              {MainStore.allEvents[MainStore.currentEventId].name}
            </Title>
          </Body>
          <Right>
            <Button transparent onPress={() => this.commentPressed()}>
              <Icon
                active
                style={{ color: "rgb(22, 251, 255)" }}
                name="chatbubbles"
              />
            </Button>
          </Right>
        </Header>
        <Content ref="scrollRef" style={{ paddingBottom: 40 }}>
          <View
            style={{
              height: 100,
              width: width,
              padding: 20,
              top: 0,
              flexDirection: "column"
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                width: "100%",
                color: "rgb(60, 67, 79)",
                alignSelf: "flex-start"
              }}
            >
              {MainStore.allEvents[MainStore.currentEventId].name}
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                marginTop: 7
              }}
            >
              <Icon
                active={true}
                name="calendar"
                style={{
                  fontSize: 12,
                  color: "rgb(60, 67, 79)",
                  marginRight: 5
                }}
              />
              <Text
                style={{
                  fontSize: 12,
                  top: 0,
                  color: "rgb(60, 67, 79)",
                  letterSpacing: 1
                }}
              >
                {MainStore.allEvents[MainStore.currentEventId].date.mm +
                  "," +
                  MainStore.allEvents[MainStore.currentEventId].date.dd +
                  " " +
                  MainStore.allEvents[MainStore.currentEventId].date.yyyy}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                marginTop: 7
              }}
            >
              <Icon
                active={true}
                name="pin"
                style={{
                  fontSize: 12,
                  color: "rgb(60, 67, 79)",
                  marginRight: 5
                }}
              />
              <Text
                style={{
                  fontSize: 12,
                  top: 0,
                  color: "rgb(60, 67, 79)",
                  letterSpacing: 1
                }}
              >
                {MainStore.allEvents[MainStore.currentEventId].location}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                marginVertical: 7
              }}
            >
              <Icon
                active={true}
                name="thumbs-up"
                style={{
                  fontSize: 12,
                  color: "rgb(60, 67, 79)",
                  marginRight: 5
                }}
              />
              <Text
                style={{
                  fontSize: 12,
                  top: 0,
                  color: "rgb(60, 67, 79)",
                  letterSpacing: 1
                }}
              >
                {Object.keys(
                  MainStore.allEvents[MainStore.currentEventId].likes
                ).length + " Likes"}
              </Text>
            </View>
          </View>
          {Object.keys(self.state.eve.description).map((item, index) => {
            if (self.state.eve.description[item].type === "text") {
              return self.renderText(self.state.eve.description[item], index);
            }
            if (self.state.eve.description[item].type === "image") {
              return self.renderImage(self.state.eve.description[item], index);
            }
            if (self.state.eve.description[item].type === "video") {
              return self.renderVideo(self.state.eve.description[item], index);
            }
          })}
        </Content>
        <Animated.View
          style={{
            height: 50,
            width: 50,
            position: "absolute",
            top: height - 70,
            left: width - 80,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "transparent",
            transform: [{ translateY: jumpHeart }, { scale: scaleHeart }]
          }}
        >
          <TouchableOpacity
            style={{ backgroundColor: "transparent" }}
            onPress={() => {
              this.jumpHeart();
              this.likePressed();
            }}
          >
            <Icon
              name="heart"
              active
              style={{
                fontSize: 40,
                fontWeight: "bold",
                color: this.state.liked
                  ? "rgb(247, 27, 129)"
                  : "rgb(60, 67, 79)"
              }}
            />
          </TouchableOpacity>
        </Animated.View>
        <Animated.View
          style={{
            position: "absolute",
            elevation: Platform.OS === "ios" ? null : 10,
            top: 0,
            height: height,
            width: width,
            flexDirection: "row",
            transform: [{ translateX: movCom }]
          }}
        >

          <View style={{ flex: 1 }}>
            <TouchableOpacity
              onPress={() => this.commentPressed()}
              style={{ flex: 1 }}
            />
          </View>
          <View
            style={{
              flex: 3,
              backgroundColor: "rgb(60, 67, 79)"
            }}
          >
            <TouchableOpacity
              style={{
                position: "absolute",
                height: 70,
                width: "100%",
                alignSelf: "stretch",
                top: 10,
                justifyContent: "center",
                alignItems: "center"
              }}
              onPress={() => this.commentPressed()}
            >
              <Icon
                name="close-circle"
                active
                style={{ color: "rgb(22, 251, 255)" }}
              />
            </TouchableOpacity>

            <TextInput
              multiline={true}
              numberOfLines={2}
              placeholderTextColor={"rgba(255,255,255,0.5)"}
              placeholder={"..thoughts.."}
              style={{
                height: 80,
                alignSelf: "center",
                width: "80%",
                paddingLeft: 15,
                paddingRight: 15,
                paddingTop: 15,
                position: "absolute",
                borderWidth: 3,
                borderRadius: 10,
                borderColor: "rgb(22, 251, 255)",
                top: 80,
                fontSize: 17,
                fontWeight: "bold",
                color: "white"
              }}
              onChangeText={val => this.setState({ commentEntered: val })}
              value={this.state.commentEntered}
            />
            <Button
              rounded
              light
              style={{
                alignSelf: "center",
                position: "absolute",
                top: 180
              }}
              onPress={() =>
                this.commentSubmit(
                  MainStore.allEvents[MainStore.currentEventId]
                )}
            >
              <Text style={{ fontWeight: "bold", color: "rgb(60, 67, 79)" }}>
                SUBMIT
              </Text>
            </Button>
            <ScrollView
              onScrollBeginDrag={e =>
                this.setState({
                  scrolling: true
                })}
              onScrollEndDrag={e =>
                this.setState({
                  scrolling: false
                })}
              onMomentumScrollEnd={e =>
                this.setState({
                  scrolling: false
                })}
              style={{
                height: height - 250,
                top: 250,
                position: "absolute",
                width: 3 * width / 4,
                paddingHorizontal: 10
              }}
            >
              {this.renderComments()}
            </ScrollView>
          </View>
        </Animated.View>
      </Container>
    );
  }

  likePressed() {
    if (this.state.liked) {
      this.unlike();
      this.setState({
        liked: false
      });
    } else if (!this.state.liked) {
      this.like();
      this.setState({
        liked: true
      });
    }
  }
  like() {
    firebase
      .database()
      .ref(
        "Users/" +
          MainStore.currentUserId +
          "/likes/" +
          MainStore.currentEventId
      )
      .set({
        liked: true
      });
    firebase
      .database()
      .ref(
        "Events/" +
          MainStore.currentEventId +
          "/likes/" +
          MainStore.currentUserId
      )
      .set({
        liked: true
      });
    MainStore.refreshAllData();
  }
  unlike() {
    firebase
      .database()
      .ref(
        "Users/" +
          MainStore.currentUserId +
          "/likes/" +
          MainStore.currentEventId
      )
      .remove();
    firebase
      .database()
      .ref(
        "Events/" +
          MainStore.currentEventId +
          "/likes/" +
          MainStore.currentUserId
      )
      .remove();
    MainStore.refreshAllData();
  }
}
