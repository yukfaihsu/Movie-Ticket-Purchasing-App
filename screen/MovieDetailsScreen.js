import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { FontAwesome } from '@expo/vector-icons'; 

import { auth } from "../FirebaseApp";
import { onAuthStateChanged } from "firebase/auth";

const MovieDetailsScreen = ( {navigation, route} ) => {

    const {movie} = route.params;

    const [imageURL, setImageURL] = useState('');
    const [title, setTitle] = useState('');
    const [rating, setRating] = useState(0);
    const [releaseDate, setReleaseDate] = useState('');
    const [plotSummary, setPlotSummary] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect( () => { 
        console.log("MovieDetailsScreen rendered");
        setImageURL(`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`) ;
        setTitle(movie.title);

        const rate = movie.vote_average * 10;
        setRating(rate);
        setReleaseDate(movie.release_date);
        setPlotSummary(movie.overview);

        const listener = onAuthStateChanged(auth, (userFromFirebaseAuth) => {
            if (userFromFirebaseAuth) {
              console.log(userFromFirebaseAuth);
              setIsLoggedIn(true);
            }
            else {
              setIsLoggedIn(false);
            }
          });
        return listener;
    }, []);


    return (
        <ScrollView style={styles.container}>
            
            <Image source={{uri: imageURL !== '' ? imageURL : undefined}} style={styles.imgAnime}/>

            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginStart: 15,
                marginEnd: 15,
            }}>
                <Text style={styles.title}>{title}</Text>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                }}>
                    <Text style={styles.rating}>{rating}%</Text>
                    <FontAwesome name='star' size={25} color='#FFD633' />
                </View>
            </View>
            
            <Text style={styles.releaseDate}>{releaseDate}</Text>

            <Text style={styles.plotSummaryTitle}>Plot Summary</Text>
            <Text style={styles.plotSummary}>{plotSummary}</Text>
            

            {
                isLoggedIn ?
                (
                    <View style={{ marginTop: 140, alignItems: 'center' }}>
                        <Pressable style={{ 
                                backgroundColor:'#EE4466', 
                                width: 350, 
                                height:50,
                                borderRadius: 5,
                                marginTop: 5,
                                marginBottom: 20,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                            onPress={() => {
                                navigation.navigate('BuyTicketsScreen', {MOVIE_ID: movie.id, MOVIE_NAME: movie.title})}
                            }
                        >
                            <Text style={{fontSize: 17, color: '#FFF'}}>Buy Tickets</Text>
                        </Pressable>
                    </View>
                )
                :
                (
                    <View style={{ marginTop: 50, alignItems: 'center' }}>
                        <Text>You must be logged in to use this feature.</Text>

                        <Pressable style={{ 
                                backgroundColor:'#CCCCCC', 
                                width: 350, 
                                height:50,
                                borderRadius: 5,
                                marginTop: 5,
                                marginBottom: 20,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <Text style={{fontSize: 17, color: '#0059B3'}}>Buy Tickets</Text>
                        </Pressable>

                        <Pressable style={{ 
                                backgroundColor:'#EE4466', 
                                width: 350, 
                                height:50,
                                borderRadius: 5,
                                marginTop: 5,
                                marginBottom: 20,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                            onPress={()=>{navigation.navigate('LoginScreen')}}
                        >
                            <Text style={{fontSize: 17, color: '#FFF'}}>Login or Create New Account</Text>
                        </Pressable>
                    </View>
                ) 
            }

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    imgAnime: {
        width: '100%',
        height: 300,
        padding: 10,
        marginBottom: 10
    },
    title: {
        fontSize: 22,
        fontWeight:'bold',
    },
    rating: {
        fontSize: 22,
    },
    releaseDate: {
        marginStart: 15,
        fontSize: 19,
        color: '#737373',
    },
    plotSummaryTitle: {
        marginStart: 15,
        marginTop: 20,
        fontSize: 19,
        fontWeight: 'bold',
    },
    plotSummary: {
        marginStart: 15,
        marginEnd: 15,
        marginTop: 8,
        fontSize: 15,
    }
});

export default MovieDetailsScreen;