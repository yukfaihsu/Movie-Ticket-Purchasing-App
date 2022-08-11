import { StyleSheet, Text, View, Pressable, FlatList } from 'react-native';
import React, { useState } from "react";
import { db } from "../FirebaseApp"
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../FirebaseApp";
import { FontAwesome } from '@expo/vector-icons'; 
import { useFocusEffect } from '@react-navigation/native';

const MyPurchasesScreen = ({navigation}) => {
    const [purchasesData, setPurchasesData] = useState([]);
    const [userLoggedIn, setUserLoggedIn] = useState(true);

    const getPurchasesData = async (uid) => {
        try {
            const q = query(collection(db, "users-purchases"), where("userId", "==", uid));
            const querySnapshot = await getDocs(q);
            
            let purchasesList = [];
            querySnapshot.forEach((doc) => {
                let documentToBeInserted = doc.data();
                purchasesList.push(documentToBeInserted);
            });
            setPurchasesData(purchasesList);
        } catch (error) {
            console.log(`${error.message}`);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            const unsubscribe = onAuthStateChanged(auth, (userFromFirebaseAuth) => {
                if (userFromFirebaseAuth) {
                    getPurchasesData(userFromFirebaseAuth.uid);
                    setUserLoggedIn(true);
                } else { setUserLoggedIn(false); }
            })
            return () => { unsubscribe(); };
        }, [])
    );

    return (
        (userLoggedIn)?
        (
            <View style={styles.container}>
            <Text style={{padding: 15, fontSize: 25}}>Your Tickets</Text>
            <FlatList
                data={purchasesData}
                renderItem={({ item }) => ( 
                <View style={styles.itemlayout}>
                    <View style={{marginLeft: 20}}>
                        <FontAwesome name="ticket" size={40} color="#0c6da6" />
                    </View>
                    <View style={styles.purchaseInfo}>
                        <Text style={{fontSize: 18, fontWeight: '500'}}>{item.movieName}</Text>
                        <Text style={{fontSize: 16}}>Num Tickets: {item.numTickets}</Text>
                        <Text style={{fontSize: 16, color: '#911c33'}}>Total Paid: ${item.total}</Text>
                    </View>
                </View>
                )}
                style={styles.flatList}
            />
            </View>
        )
        :
        (
            <View style={styles.container}>
            <Text style={{fontSize: 25, marginBottom: 18}}>Your Tickets</Text>
            <Text style={{fontSize: 18}}>You must be logged in to use this feature.</Text>
            <Pressable style={styles.goToLoginBtn} onPress={() => { navigation.navigate('LoginScreen'); }}>
                <Text style={{fontSize: 22, color: 'white'}}>Login or Create New Account</Text>
            </Pressable>
            </View>
        )
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemlayout: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "white",
        justifyContent: "flex-start",
        padding: 0, 
        borderBottomColor: '#D6D6D6', 
        borderBottomWidth: 1.5,
        height: 80
    },
    purchaseInfo: {
        flexDirection: "column",
        justifyContent: 'center',
        height: 70,
        width: 350,
        paddingLeft: 20
    },
    goToLoginBtn: {
        width: 300,
        height:50,
        backgroundColor: "#EE4466",
        borderRadius: 5,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    },
    flatList: {
        width: 430
    }
})

export default MyPurchasesScreen;