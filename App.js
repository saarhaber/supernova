import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './screens/Home';
import Search from './screens/Search';
import Scan from './screens/Scan';
import Bookevents from './screens/Bookevents';
import Favorite from './screens/Favorite';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

//const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {
  return (
    /*
    <NavigationContainer>
     <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: 'Supernova' }}
        />
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="Scan" component={Scan} />
        <Stack.Screen name="Favorite" component={Favorite} />
        <Stack.Screen name="Bookevents" component={Bookevents} />
      </Stack.Navigator>
    </NavigationContainer>
      */
    <NavigationContainer>
      <Tab.Navigator> 
        <Tab.Screen
          name="Home"
          component={Home}
          options={{ title: 'Supernova' }}
        />
        <Tab.Screen name="Search" component={Search} />
        <Tab.Screen name="Scan" component={Scan} />
        <Tab.Screen name="Favorite" component={Favorite} />
        <Tab.Screen name="Bookevents" component={Bookevents} />
      </Tab.Navigator>
    </NavigationContainer>


  );
};

export default App;