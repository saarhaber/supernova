import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Home from './screens/Home';
import Search from './screens/Search';
import Scan from './screens/Scan';
import Bookevents from './screens/Bookevents';
import Favorite from './screens/Favorite';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
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