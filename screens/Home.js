import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    FlatList,
    Image,
    Button
    
} from 'react-native';

import Title from "../components/Title";
import EventBox from "../components/EventBox";
import EventsService from "../services/events.service";
import * as firebase from 'firebase';

class Home extends Component{

    constructor(props) {
        super(props);
        this.firestoreRef = firebase.firestore().collection('rbnbs');
        this.state = {
            apartmentList: [],
            cheapApartment: [],
            apartFor2: [],
            rbnbArr: []
        }
    }

    async componentDidMount() {
        let apartmentList = await EventsService.list();
        let cheapApartment = await EventsService.getCheapApartment();
        let apartFor2 = await EventsService.getApartmentFor2();
        this.setState({apartmentList, cheapApartment, apartFor2});
        this.rbnbs = this.firestoreRef.onSnapshot(this.getCollection);
    }

    getCollection = (querySnapshot) => {
        const rbnbArr = [];
        querySnapshot.forEach((res) => {
          const { name, description, imgSource } = res.data();
          rbnbArr.push({
            key: res.id,
            res,
            name,
            description,
            imgSource,
          });
        });
        this.setState({
          rbnbArr,
       });
      }

    render() {

        let {apartmentList, cheapApartment, apartFor2} = this.state;
        let {navigation} = this.props;

        return (
            <View style={{ flex: 1 }}>
                <ScrollView style={styles.container}>

                    <Title title={"Appartements à bas prix"}/>

                    <FlatList
                        data={apartmentList}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        backgroundColor={"#FFF"}
                        keyExtractor={item => item.id}
                        renderItem={({item}) => <EventBox navigation={navigation} data={item.fields} horizontal={true}/>} />

                    <Title title={"Liste de vos appartements"}/>

                     {
                        this.state.rbnbArr.map((item, i) => {
                        return (
                            <View  style={styles.view}>
                               <Title title={item.name}
                               /> 
                               
                               <Text> Description : **{item.description}**</Text>
                               <Button 
                                title="Details"
                                onPress={()=>{
                                    this.props.navigation.navigate('rbnbDetails', {
                                        rbnbkey: item.key
                                    })
                                }}
                                />
                            </View>
                        );
                        })
                    }

                    <FlatList
                        data={cheapApartment}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        backgroundColor={"#FFF"}
                        keyExtractor={item => item.id}
                        renderItem={({item}) => <EventBox navigation={navigation} data={item.fields} horizontal={true}/>} />

                        <Title title={"Pour les weekends en couple"}/>

                    <FlatList
                        data={apartFor2}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        backgroundColor={"#FFF"}
                        keyExtractor={item => item.id}
                        renderItem={({item}) => <EventBox navigation={navigation} data={item.fields} horizontal={true}/>} />
                </ScrollView>
            </View>
        )
    }

}

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
        paddingTop: 70
    },
    view: {
        flex:1,
        backgroundColor: "#FFF",
        padding:10,
    }
});
