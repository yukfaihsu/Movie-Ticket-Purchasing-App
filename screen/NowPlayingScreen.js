import { useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity,Text, View, } from "react-native";
import { FontAwesome } from '@expo/vector-icons'; 

const API_LINK = "https://api.themoviedb.org/3/movie/now_playing?api_key=53be069d0ff039b658f50bb2a0fe60b6&%20language=en-US&page=1&region=CA";

const NowPlayingScreen = ( {navigation, route} ) => {
    const [movieData, setMovieData] = useState([]);

    useEffect( () => {
        console.log("NowPlayingScreen rendered");
        getMovieFromAPI();
    }, []);

    const getMovieFromAPI = async () => {
        try {
            const response = await fetch(API_LINK);
            const jsonData = await response.json();
            console.log(`Response JSON Data : ${jsonData.results.length}`);
            setMovieData(jsonData.results); 
        } 
        catch (error) {
            console.error(error);
        }
    }

    const renderItem = ( {item} ) => (
        <TouchableOpacity onPress={ () => {
            console.log(`going to details screen, movie title: ${item.title}`);
            navigation.navigate("MovieDetailsScreen", {movie: item});
        }
        }
        >
            <View style={styles.listItem}>
                <View style={styles.movieInfo}>
                    <Text style={styles.title}> {item.title} </Text>
                    <Text style={styles.releaseDate}> Release Date: {item.release_date}</Text>
                </View>

                <FontAwesome name="angle-right" size={30} color="orangered"/>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.screenTitle}>Now Playing</Text>

                <FlatList 
                data={movieData}
                keyExtractor={ (item) => {return item.id}}
                renderItem={ renderItem }
                />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    screenTitle: {
        fontSize: 30,
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    listItem: {
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20, 
        borderBottomColor: '#D6D6D6', 
        borderBottomWidth: 1,
    },
    movieInfo: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight:'bold',
    },
    releaseDate: {
        fontSize: 15,
    }
  });

export default NowPlayingScreen;