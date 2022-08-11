import { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, Pressable, Alert } from "react-native";
import { db } from "../FirebaseApp"
import { collection, addDoc } from "firebase/firestore"; 
import { auth } from "../FirebaseApp";
import { onAuthStateChanged } from "firebase/auth";

const PRICE_PER_TICKET = 12;
const TAX = 0.13;

const BuyTicketsScreen = ({navigation, route}) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [numOfTickets, setNumOfTickets] = useState(0);
    const [movieName, setMovieName] = useState('');
    const [subTotal, setSubTotal] = useState('');
    const [tax, setTax] = useState('');
    const [total, setTotal] = useState('');
    const [shouldShowSummary, setShouldShowSummary] = useState(false);
    
    const [userId, setUserId] = useState('');
    const [movieId, setMovieId] = useState();

    const {MOVIE_ID, MOVIE_NAME} = route.params;

    useEffect(() => {
        const listener = onAuthStateChanged(auth, (userFromFirebaseAuth) => {
            if (userFromFirebaseAuth) {
                setEmail(userFromFirebaseAuth.email);
                setUserId(userFromFirebaseAuth.uid);
                setMovieId(MOVIE_ID);
                setMovieName(MOVIE_NAME);
            } else { navigation.popToTop(); }
        })
        return listener;
    }, [])

    const operatorBtnPressed = (operator) => {
        let num = numOfTickets;
        if (operator === "+") {
            calculateTotal(++num);
            setNumOfTickets(num);
        } else if (operator === "-" && num > 0) {
                calculateTotal(--num);
                setNumOfTickets(num);
        }
        setShouldShowSummary(num !== 0);
    }

    const calculateTotal = (num) => {
        const subTotal = num * PRICE_PER_TICKET;
        const tax = subTotal * TAX;
        const total = subTotal + tax;

        setSubTotal(subTotal.toFixed(2));
        setTax(tax.toFixed(2));
        setTotal(total.toFixed(2));
    }

    const confirmBtnPressed = async () => {

        if (name === '') {
            Alert.alert('Error', `You must enter your name to purchase tickets!`);
            return;
        }

        if (numOfTickets === 0) {
            Alert.alert('Error', `Number of tickets cannot be 0!`);
            return;
        }

        const purchaseToAdd = {
            movieId: movieId,
            movieName: movieName,
            nameOnPurchase: name,
            numTickets: numOfTickets,
            total: total,
            userId: userId
         }
         
         try {
            const insertedDoc = await addDoc(collection(db, "users-purchases"), purchaseToAdd)
            console.log(`Document created, id is: ${insertedDoc.id}`)
            Alert.alert(`Purchase Success!`);
            navigation.popToTop();
         } catch (error) {
            console.log(`${error.message}`)
         }
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.screenTitle}>Buy Tickets</Text>
                <Text style={{ fontSize: 22, fontWeight: 'bold' }}>{movieName}</Text>
                <Text style={styles.label}>Your email address:</Text>
                <TextInput 
                    style={styles.textInput}
                    value={email}
                    editable={false}
                />
                <Text style={styles.label}>Your name:</Text>
                <TextInput 
                    style={styles.textInput}
                    onChangeText={setName}
                    value={name}
                />
                <Text style={styles.label}>Number of Tickets:</Text>
                <View style={styles.ticketSelectionLayout}>
                    <Pressable style={styles.selector} onPress={() => {
                        operatorBtnPressed("-")
                    }}><Text  style={styles.operator}>-</Text></Pressable>
                    <Text style={styles.numOfTickets}>{numOfTickets}</Text>
                    <Pressable style={styles.selector} onPress={() => {
                        operatorBtnPressed("+")
                    }}><Text style={styles.operator}>+</Text></Pressable>
                </View>
                { (shouldShowSummary) && <Text style={styles.label}>Order Summary:</Text> }
                {
                    (shouldShowSummary) &&
                    <View style={styles.summaryLayout}>
                        <Text style={styles.summaryText}>{movieName}</Text>
                        <Text style={styles.summaryText}>Number of Tickets: {numOfTickets}</Text>
                        <Text style={styles.summaryText}>Subtotal: ${subTotal}</Text>
                        <Text style={styles.summaryText}>Tax: ${tax}</Text>
                        <Text style={styles.totalText}>Total: ${total}</Text>
                    </View>
                }
                <Pressable style={styles.confirmBtn} onPress={() => {
                    confirmBtnPressed();
                }}><Text style={{fontSize: 22, color: 'white'}}>Confirm Purchase</Text></Pressable>
            </View>
        </ScrollView>
    ); 
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center'
    },
    screenTitle: {
        fontSize: 25,
        marginTop: 25,
        marginBottom: 25
    },
    label: {
        fontSize: 20,
        width: 355,
        paddingBottom: 2,
        marginTop: 20
    },
    textInput: {
        fontSize: 20,
        height: 40,
        width: 355,
        borderWidth: 1,
        borderColor: "grey",
        paddingLeft: 10,
    },
    confirmBtn: {
        width: 355,
        height: 50,
        backgroundColor: "#EE4466",
        borderRadius: 5,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        marginTop: 690
    },
    ticketSelectionLayout: {
        flexDirection: "row",
        width: 355,
    },
    selector: {
        borderColor: 'orange',
        borderWidth: 1.5,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    numOfTickets: {
        fontSize: 25,
        width: 40,
        height: 40,
        textAlign: 'center',
        padding: 5,
    },
    operator: {
        fontSize: 30, 
        color: 'orange',
        height: 30,
        width: 30,
        textAlign: 'center',
        marginBottom: 8
    },
    summaryLayout: {
        borderColor: 'grey',
        borderWidth: 1,
        width: 355,
        marginTop: 8,
    },
    summaryText: {
        fontSize: 20,
        paddingLeft: 18,
        paddingTop: 4,
    },
    totalText: {
        backgroundColor: '#d6e62e',
        width: 353,
        paddingLeft: 18,
        paddingBottom: 8,
        paddingTop: 8,
        fontSize: 20,
        marginTop: 5
    }
});

export default BuyTicketsScreen;