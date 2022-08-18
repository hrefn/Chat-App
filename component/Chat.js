import React, { Component } from "react";
import { StyleSheet, View } from "react-native";

export default class Chat extends React.Component {

  componentDidMount () {
    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });
  }


  render () {
    let { backgroundColor } = this.props.route.params;
    return (
      <View style={[{ backgroundColor: backgroundColor }, styles.container]}>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});