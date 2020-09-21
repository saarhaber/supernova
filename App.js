import * as React from 'react';
import { Button, StyleSheet, Text, View, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function HomeScreen({navigation}) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details', {
          itemId: 86,
          otherParam: 'anything you want here',
        })}
      />
    </View>
  );
}
function DetailsScreen({ route, navigation }) {
  const { itemId } = route.params;
  const { otherParam } = route.params;
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Text>itemId: {JSON.stringify(itemId)}</Text>
      <Text>otherParam: {JSON.stringify(otherParam)}</Text>
      <Button
        title="Go to Details... again"
        onPress={() =>
          navigation.push('Details', {
            itemId: Math.floor(Math.random() * 100),
          })
        }
      />
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}
const Stack = createStackNavigator();

 function App() {
  return (
    <NavigationContainer>
    <Stack.Navigator>
    <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Supernova' }} />
    <Stack.Screen name="Details" component={DetailsScreen} />
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
