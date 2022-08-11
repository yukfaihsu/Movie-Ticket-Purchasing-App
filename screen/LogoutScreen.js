import { StyleSheet, Text, View, TextInput, Pressable, Alert } from 'react-native';
import { signOut } from "firebase/auth"
import { auth } from "../FirebaseApp";

const LogoutScreen = () => {

    const LogoutBtnPressed = async () => {
        try {
            await signOut(auth);
            Alert.alert(`Logout success`);
        } catch (err) {
            Alert.alert(`Logout failed: ${err.message}`);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={{fontSize: 25, paddingBottom: 5}}>Are you ready to logout?</Text>
            <Pressable style={styles.LogoutBtn} onPress={() => {
                LogoutBtnPressed();
            }}><Text style={{fontSize: 22, color: 'white'}}>Logout</Text></Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    },
    LogoutBtn: {
        width: 355,
        height:50,
        backgroundColor: "#EE4466",
        borderRadius: 5,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
    }

});

export default LogoutScreen;