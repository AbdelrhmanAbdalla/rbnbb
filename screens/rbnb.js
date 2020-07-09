// screens/rbnb.js

import React, { Component } from 'react';
import { TouchableOpacity, Text, Button, StyleSheet, TextInput, ScrollView, ActivityIndicator, View } from 'react-native';
import * as firebase from 'firebase';
import * as  ImagePicker  from 'expo-image-picker';
import * as Permissions from 'expo-permissions';



class rbnb extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      description: '',
      imgSource: '',
    };
  }

  pickImage = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
    if(status ==="granted"){
      alert("Obefijezjfoizej");
      let result = await ImagePicker.launchImageLibraryAsync();
      if (!result.cancelled){
        this.setState({imgSource : result.uri})
      }
    }
  };

  inputValueUpdate = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  storeRbnb() {
    if(this.state.name === ''){
     alert('Remplissez le nom de votre RBNB!')
    }else if(this.state.description === ''){
        alert('Remplissez la description de votre RBNB!')
       } else {
      this.setState({
        isLoading: true,
      });      
      firebase.firestore().collection('rbnbs').add({
        name: this.state.name,
        description: this.state.description,
        imgSource:this.state.imgSource,
      }).then((res) => {
        this.setState({
          name: '',
          description: '',
          imgSource:'',
          isLoading: false,
        });
        this.props.navigation.navigate('Home')
      })
      .catch((err) => {
        console.error("Error found: ", err);
        this.setState({
          isLoading: false,
        });
      });
    }
  }

  render() {
    if(this.state.isLoading){
      return(
        <View style={styles.preloader}>
          <ActivityIndicator size="large" color="#9E9E9E"/>
        </View>
      )
    }
    return (
      <ScrollView style={styles.container}>
        <View style={styles.inputGroup}>
        <Text style={styles.text}> Nom de votre RBNB</Text>
          <TextInput
              placeholder={'Name'}
              value={this.state.name}
              onChangeText={(val) => this.inputValueUpdate(val, 'name')}
          />
        </View>
        <View style={styles.inputGroup}>
        <Text style={styles.text}> Description</Text>
          <TextInput
              multiline={true}
              numberOfLines={4}
              placeholder={'Description'}
              value={this.state.description}
              onChangeText={(val) => this.inputValueUpdate(val, 'description')}
          />
        </View>
        <Text style={styles.text}> Photo du lieu</Text>
        <TouchableOpacity style={styles.btn} onPress={this.pickImage}>
          <View>
            <Button
              title = "Choose image.." 
              onPress={this.pickImage}
            />
          </View>
        </TouchableOpacity>

        <View style={styles.btnText}>
          <Button
            title='Add RBNB'
            onPress={() => this.storeRbnb()} 
            color="#19AC52"
          />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 200,
    padding:10,
  },
  text:{
    flex: 1,
    padding: 0,
    marginBottom: 20,
    textAlign:'center',
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    fontWeight:'bold',
    fontSize:20
  },  
  inputGroup: {
    flex: 1,
    padding: 0,
    marginBottom: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  preloader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center'
  },
  btn: {
    borderWidth: 1,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 20,
    borderColor: 'rgba(0,0,0,0.3)',
    backgroundColor: 'rgb(68, 99, 147)'
  },
  btnTxt: {
    color: '#fff',
    marginTop:5,

  },
  image: {
    marginTop: 20,
    minWidth: 200,
    height: 200
  }
})

export default rbnb;