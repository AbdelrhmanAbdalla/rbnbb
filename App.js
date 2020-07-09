import React, {Component} from 'react';
import {decode, encode} from 'base-64'
import Icon from 'react-native-vector-icons/FontAwesome';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createStackNavigator } from 'react-navigation-stack';
import { Provider } from 'react-redux';
import { createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import AsyncStorage from '@react-native-community/async-storage';
import rootReducer from './helpers/rootReducer';
import Splash from "./screens/Splash";
import Home from "./screens/Home";
import Details from "./screens/Details";
import Profil from "./screens/Profil";
import Search from "./screens/Search";
import Login from "./screens/Login";
import * as firebase from 'firebase';
import firestore from 'firebase/firestore'
import rbnb from './screens/rbnb';
import rbnbDetails from './screens/rbnbDetail';

if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

const firebaseConfig = {
    apiKey: "AIzaSyAqg9mrXrJI1H-hplYJptff5K7ogvpYj7A",
    authDomain: "rbnb-a870e.firebaseapp.com",
    databaseURL: "https://rbnb-a870e.firebaseio.com",
    projectId: "rbnb-a870e",
    storageBucket: "rbnb-a870e.appspot.com",
    messagingSenderId: "230943438573",
    appId: "1:230943438573:web:ebf72fe2c8c4418dc8bee4"
}

try {
    firebase.initializeApp(firebaseConfig);
    } catch (err) {
    if (!/already exists/.test(err.message)) {
    console.error('Firebase initialization error', err.stack)
    }
    }
firebase.firestore();


const persistConfig = {key: 'root', storage: AsyncStorage};
const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = createStore(persistedReducer);
const persistor = persistStore(store);


const BottomNavigator = createBottomTabNavigator(
    {
        Home: {
            screen: Home,
            navigationOptions: () => ({
                tabBarIcon: ({tintColor}) => (
                    <Icon
                        name={"list"}
                        color={tintColor}
                        size={24}
                    />
                )
            })
        },
        Search: {
            screen: Search,
            navigationOptions: () => ({
                tabBarIcon: ({tintColor}) => (
                    <Icon
                        name={"search"}
                        color={tintColor}
                        size={24}
                    />
                )
            })
        },
        RBNB: {
            screen: rbnb,
            navigationOptions: () => ({
                tabBarIcon: ({tintColor}) => (
                    <Icon
                        name={"bed"}
                        color={tintColor}
                        size={24}
                    />
                )
            })
        },
        Profil: {
            screen: Profil,
            navigationOptions: () => ({
                tabBarIcon: ({tintColor}) => (
                    <Icon
                        name={"user"}
                        color={tintColor}
                        size={24}
                    />
                )
            })
        }

    },
    {
        tabBarOptions: {
            showLabel: false,
            activeTintColor: '#7766C6',
            inactiveTintColor: 'black',
        }
    }
);

const AppNavigator = createStackNavigator(
    {
        Splash: {screen: Splash, navigationOptions: {headerShown: false}},
        Login: {screen: Login, navigationOptions: {headerShown: false}},
        Home: {screen: BottomNavigator, navigationOptions: {headerShown: false}},
        Rbnb: {screen: rbnb, navigationOptions: {headerShown: false}},
        rbnbDetails: {screen: rbnbDetails, navigationOptions: {headerShown: false}},
        Details: {screen: Details, navigationOptions: {headerShown: false}},
    },
    {
        initialRouteName: 'Splash'
    }
);

const AppContainer = createAppContainer(AppNavigator);

class App extends Component{
    render() {
      return <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
                <AppContainer/>
          </PersistGate>
      </Provider>
    }
}

export default App;
