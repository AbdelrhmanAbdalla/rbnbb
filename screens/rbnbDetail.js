// screens/rbnbDetails.js

import React, { Component } from 'react';
import { Alert, Button, StyleSheet, TextInput, ScrollView, ActivityIndicator, View } from 'react-native';
import * as firebase from 'firebase';

class rbnbDetails extends Component {

  constructor() {
    super();
    this.state = {
      name: '',
      description: '',
      imgSource: '',
      isLoading: true
    };
  }
 
  componentDidMount() {
    const dbRef = firebase.firestore().collection('rbnbs').doc(this.props.route.params.rbnbkey)
    dbRef.get().then((res) => {
      if (res.exists) {
        const rbnb = res.data();
        this.setState({
          key: res.id,
          name: rbnb.name,
          description: rbnb.description,
          imgSource: rbnb.imgSource,
          isLoading: false
        });
      } else {
        console.log("Document does not exist!");
      }
    });
  }

  inputValueUpdate = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  updateRbnb() {
    this.setState({
      isLoading: true,
    });
    const updateDBRef = firebase.firestore().collection('rbnbs').doc(this.state.key);
    updateDBRef.set({
      name: this.state.name,
      description: this.state.description,
      imgSource: this.state.imgSource,
    }).then((docRef) => {
      this.setState({
        key: '',
        name: '',
        description: '',
        imgSource: '',
        isLoading: false,
      });
      this.props.navigation.navigate('Home');
    })
    .catch((error) => {
      console.error("Error: ", error);
      this.setState({
        isLoading: false,
      });
    });
  }

  deleteRbnb() {
    const dbRef = firebase.firestore().collection('rbnbs').doc(this.props.route.params.rbnbkey)
      dbRef.delete().then((res) => {
          alert('Item removed from database')
          this.props.navigation.navigate('Home');
      })
  }

  openTwoButtonAlert=()=>{
    Alert.alert(
      'Delete rbnb',
      'Are you sure?',
      [
        {text: 'Yes', onPress: () => this.deleteRbnb()},
        {text: 'No', onPress: () => console.log('No item was removed'), style: 'cancel'},
      ],
      { 
        cancelable: true 
      }
    );
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
          <TextInput
              placeholder={'Name'}
              value={this.state.name}
              onChangeText={(val) => this.inputValueUpdate(val, 'name')}
          />
        </View>
        <View style={styles.inputGroup}>
          <TextInput
              multiline={true}
              numberOfLines={4}
              placeholder={'Description'}
              value={this.state.description}
              onChangeText={(val) => this.inputValueUpdate(val, 'description')}
          />
        </View>
        <View style={styles.inputGroup}>
          <TextInput
              placeholder={'Image'}
              value={this.state.imgSource}
              onChangeText={(val) => this.inputValueUpdate(val, 'imgSource')}
          />
        </View>
        <View style={styles.button}>
          <Button
            title='Update'
            onPress={() => this.updateRbnb()} 
            color="#19AC52"
          />
          </View>
         <View>
          <Button
            title='Delete'
            onPress={this.openTwoButtonAlert}
            color="#E37399"
          />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35
  },
  inputGroup: {
    flex: 1,
    padding: 0,
    marginBottom: 15,
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
  button: {
    marginBottom: 7, 
  }
})

export default rbnbDetails;