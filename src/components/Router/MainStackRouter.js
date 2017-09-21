import React, { Component } from "react";
import LoginComponent from "../LoginComponent/LoginScreen";
import { StackNavigator } from "react-navigation";
import EventsPage from "../Events/EventList";
import Details from "../Events/Details";
import ProfileScreen from "../profile/ProfileScreen";
export default (MainStackRouter = StackNavigator({
  LoginComponent: { screen: LoginComponent },
  EventsPage: { screen: EventsPage },
  EventDetails: { screen: Details },
  ProfileScreen: { screen: ProfileScreen }
}));
