import React, { Component } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { GiftedChat, Bubble } from 'react-native-gifted-chat'
import firebase from 'firebase/compat';
import 'firebase/firestore'
import { initializeApp } from 'firebase/app'
import { QuerySnapshot } from "firebase/firestore";

export default class Chat extends React.Component {
  constructor () {
    super();
    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: '',
        name: '',
      },
    }

    const firebaseConfig = {
      apiKey: "AIzaSyBi25tmW-4ymbTTZ6FVBHlY229CWPmaIzM",
      authDomain: "chat-application-ab3c6.firebaseapp.com",    
      projectId: "chat-application-ab3c6",    
      storageBucket: "chat-application-ab3c6.appspot.com",
      messagingSenderId: "606247265510",
    
    }

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig)
    }
  }

  componentDidMount () {
    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });

    this.referenceChatMessages = firebase.firestore().collection('messages')

    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      this.setState({
        uid: user.uid,
        messages: [],
        user: {
          _id: user.uid,
          name: name
        }
      });
      console.log(this.state.user)
      this.unsubscribe = this.referenceChatMessages.orderBy('createdAt', 'desc').onSnapshot(this.onCollectionUpdate);
    });
  }

  componentWillUnmount () {
    this.authUnsubscribe();
    this.unsubscribe();
  }

  onSend (messages=[]) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => {
      this.addMessages();
    })
  }

  addMessages () {
    console.log('adding message')
    const message = this.state.messages[0];
    
    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: message._id,
      text: message.text,
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || null,
      location: message.location || null,
    });
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];

    querySnapshot.forEach((doc) => {
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
      });
    });
  }

  renderBubble (props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000'
          }
        }}
      />
    )
  }


  render () {
    let { backgroundColor } = this.props.route.params;
    return (
      <View style={[{ backgroundColor: backgroundColor }, styles.container]}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: this.state.user._id,
            name: this.state.user.name
          }}
        />
        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});