import * as React from 'react';
import { Button, StyleSheet, Text, View, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  );
}

const Stack = createStackNavigator();

 function App() {
  return (
    <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
    </NavigationContainer>
    // <View style={{padding: 50}}>
    //   <View>
    //     <TextInput placeholder="NYT Best Sellers" style={{padding: 10, fontSize: 30, textAlign: "center"}}/>
    //   </View>
    //   <View >
    //     <Button title="History" />
    //     <Button title="Scan" />
    //     <Button title="Favorite" />
    //   </View>
    // </View>
  );
}

// const styles = StyleSheet.create({
// });

export default App;
