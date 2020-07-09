// screens/rbnbUpdate.js

import React, { Component } from 'react';
import { Alert, Button, StyleSheet, TextInput, ScrollView, ActivityIndicator, View } from 'react-native';
import App from '../App.js';
import * as firebase from 'firebase';

class rbnbUpdate extends Component {

  constructor() {
    super();
    this.state = {
      name: '',
      description: '',
      isLoading: true
    };
  }
 
  componentDidMount() {
    const dbRef = firebase.firestore().collection('rbnbs')
    dbRef.get().then((res) => {
      if (res.exists) {
        const rbnb = res.data();
        this.setState({
          key: res.id,
          name: rbnb.name,
          description: rbnb.description,
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
    const updateDBRef = App.firestore().collection('rbnbs').doc(this.state.key);
    updateDBRef.set({
      name: this.state.name,
      description: this.state.description
    }).then((docRef) => {
      this.setState({
        key: '',
        name: '',
        description: '',
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
    const dbRef = App.firestore().collection('rbnbs').doc(this.props.route.params.userkey)
      dbRef.delete().then((res) => {
          console.log('Item removed from database')
          this.props.navigation.navigate('Home');
      })
  }

  openTwoButtonAlert=()=>{
    Alert.alert(
      'Delete Rbnb',
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
        return (
            alert("Update en cours")
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
              value={this.state.email}
              onChangeText={(val) => this.inputValueUpdate(val, 'description')}
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
  button: {
    marginBottom: 7, 
  }
})

export default rbnbUpdate;