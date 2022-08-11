import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import BuyTicketsScreen from './screen/BuyTicketsScreen';
import LogoutScreen from './screen/LogoutScreen';
import MyPurchasesScreen from './screen/MyPurchasesScreen';
import LoginScreen from './screen/LoginScreen';
import NowPlayingScreen from './screen/NowPlayingScreen';
import MovieDetailsScreen from './screen/MovieDetailsScreen';
import { useState, useEffect } from 'react';
import { auth } from "./FirebaseApp";
import { onAuthStateChanged } from "firebase/auth";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons'; 

const NowPlayingStack = createNativeStackNavigator();
const MyPurchasesStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const NowPlayingStackScreen = () => {
  return (
    <NowPlayingStack.Navigator>
      <NowPlayingStack.Screen name="NowPlayingScreen" component={NowPlayingScreen}></NowPlayingStack.Screen>
      <NowPlayingStack.Screen name="MovieDetailsScreen" component={MovieDetailsScreen}></NowPlayingStack.Screen>
      <NowPlayingStack.Screen name="BuyTicketsScreen" component={BuyTicketsScreen}></NowPlayingStack.Screen>
      <NowPlayingStack.Screen name="LoginScreen" component={LoginScreen}></NowPlayingStack.Screen>
    </NowPlayingStack.Navigator>
  );
}

const MyPurchasesStackScreen = () => {
  return (
    <MyPurchasesStack.Navigator>
      <MyPurchasesStack.Screen name="MyPurchasesScreen" component={MyPurchasesScreen}></MyPurchasesStack.Screen>
      <MyPurchasesStack.Screen name="LoginScreen" component={LoginScreen}></MyPurchasesStack.Screen>
    </MyPurchasesStack.Navigator>
  );
}

export default function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    const listener = onAuthStateChanged(auth, (userFromFirebaseAuth) => {
      if (userFromFirebaseAuth) {
        setUserLoggedIn(true);  
      } else {
        setUserLoggedIn(false);
      };
    })
    return listener;
  }, [])

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={({route}) => ({
        "tabBarActiveTintColor": "orangered",
        "tabBarInactiveTintColor": "gray",
        "headerShown": false,
        "tabBarIcon": ( {color, size} ) => {
            let iconName;

            if (route.name === "NowPlaying") {
              iconName = 'list';
            } else if (route.name === "MyPurchases") {
              iconName = 'ticket';
            } else if (route.name === "Logout") {
              iconName = 'user-o';
            }

            return  <FontAwesome name={iconName} size={size} color={color} />
        }
      })}>
         <Tab.Screen name="NowPlaying" component={NowPlayingStackScreen}/>
         <Tab.Screen name="MyPurchases" component={MyPurchasesStackScreen}/>
         {
          (userLoggedIn) && <Tab.Screen name="Logout" component={LogoutScreen}/>
         }
      </Tab.Navigator>
    </NavigationContainer>
  );
}