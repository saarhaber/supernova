import React, { Component } from "react";
import { View, Text } from "react-native"
import navStyles from '../styles/navStyles'

export default class HomeScreen extends Component {

    static navigationOptions = {
        title: "Scan",
        ...navStyles
      };

    render() {
        return (
            <View>
                <Text>Home Page!</Text>
            </View>
        );
    }
}