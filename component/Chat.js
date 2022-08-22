import React, { Component } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat'
import firebase from 'firebase/compat';
import 'firebase/firestore'
import AsyncStorage from '@react-native-async-storage/async-storage'
import NetInfo from '@react-native-community/netinfo'
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
      isConnected: true,
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
    this.getMessages();

    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });

    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        console.log('online')

        this.setState({ isConnected: true })

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
          this.unsubscribe = this.referenceChatMessages.orderBy('createdAt', 'desc').onSnapshot(this.onCollectionUpdate);
        });
      } else {
        console.log('offline');
        this.setState({ isConnected: false });
        this.getMessages();
      }
    })



  }

  async deleteMessages () {
    console.log('deletingmessages')
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: []
      })
    } catch (error) {
      console.log(error.message)
    }
  }

  componentWillUnmount () {
    this.authUnsubscribe();
    this.unsubscribe();
  }

  async getMessages () {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  onSend (messages=[]) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => {
      this.addMessages();
      this.saveMessages();
    })
  }

  async saveMessages () {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
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
    this.setState({
      messages,
    })
  }

  renderInputToolbar (props) {
    if (this.state.isConnected === false) {
    } else {
      return (
        <InputToolbar {...props} />
      );
    }
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
          renderInputToolbar={this.renderInputToolbar.bind(this)}
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