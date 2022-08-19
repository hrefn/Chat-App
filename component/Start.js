import React from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ImageBackground, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native';
import BackgroundImage from '../assets/img/Background-Image.png'


export default class Start extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      name: '',
      backgroundColor: this.colors.black,
    }
  }

  changeBackgroundColor = (color) => {
    this.setState({ backgroundColor: color })
  }

  colors = {
    black: "#090C08",
    purple: "#474056",
    gray: "#8A95A5",
    green: "B9C6AE",
  }

  render () {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={BackgroundImage}
          resizeMode='cover'
          style={styles.backgroundImage}
        >

          <View style={styles.titleContainer}>
            <Text style={styles.title}>Chat App</Text>
          </View>

          <View style={styles.box1}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                onChangeText={(text) => this.setState({ name: text })}
                value={this.state.name}
                placeholder='Enter Name'
              />
            </View>

            <View style={styles.colorContainer}>
              <Text style={styles.colorText}>Choose Background Color</Text>
            </View>

            <View style={styles.colorCircleContainer}>
              <TouchableOpacity
                style={styles.color1}
                onPress={() => this.changeBackgroundColor(this.colors.black)}></TouchableOpacity>
              <TouchableOpacity
                style={styles.color2}
                onPress={() => this.changeBackgroundColor(this.colors.purple)}></TouchableOpacity>
              <TouchableOpacity
                style={styles.color3}
                onPress={() => this.changeBackgroundColor(this.colors.gray)}></TouchableOpacity>
              <TouchableOpacity
                style={styles.color4}
                onPress={() => this.changeBackgroundColor(this.colors.green)}></TouchableOpacity>
            </View>

            <Pressable
              style={styles.button}
              onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name, backgroundColor: this.state.backgroundColor })}
            >
              <Text style={styles.buttonText}>Start Chatting</Text>
            </Pressable>
          </View>
        </ImageBackground>
        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  backgroundImage: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },

  titleContainer: {
    height: '40%',
    width: '88%',
    alignItems: 'center',
    justifyContent: 'center'
  },

  title: {
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF'
  },

  box1: {
    height: '46%',
    width: '88%',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF'
  },

  inputContainer: {
    width: '88%',
    alignItems: 'center',
    border: '2px solid gray',
    borderRadius: 1,
    height: 60,
    flexDirection: 'row'
  },

  input: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 0.5,
    width: '100%',
    height: '100%',
    textAlign: 'center'
  },
  
  colorContainer: {
    width: '88%'
  },

  colorText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 100,
    textAlign: 'center'
  },

  colorCircleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%'
  },

  color1: {
    backgroundColor: '#090C08',
    height: 50,
    width: 50,
    borderRadius: 25
  },

  color2: {
    backgroundColor: '#474056',
    height: 50,
    width: 50,
    borderRadius: 25
  },

  color3: {
    backgroundColor: '#8A95A5',
    height: 50,
    width: 50,
    borderRadius: 25
  },

  color4: {
    backgroundColor: '#B9C6AE',
    height: 50,
    width: 50,
    borderRadius: 25
  },

  button: {
    backgroundColor: '#757083',
    width: '88%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center'
  },

  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',

  }
})