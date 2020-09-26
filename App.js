import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './screens/Home';

import Search from './screens/Search';
import Scan from './screens/Scan';
import Bookevents from './screens/Bookevents';
import Favorite from './screens/Favorite';

const Stack = createStackNavigator();

const App = () => {
  return (
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
  );
};

export default App;