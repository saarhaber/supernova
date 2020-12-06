import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Home from './screens/Home';
import Search from './screens/Search';
import Scan from './screens/Scan';
import Bookevents from './screens/Bookevents';
import Favorite from './screens/Favorite';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Amplify from 'aws-amplify'
import config from './aws-exports'
import { withAuthenticator } from 'aws-amplify-react-native'

Amplify.configure(config)
import { Ionicons } from '@expo/vector-icons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons'; 

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            if (route.name === 'Home') {
              return (
                <Ionicons
                  name={
                    focused
                      ? 'ios-planet'
                      : 'ios-planet'
                  }
                  size={size}
                  color={color}
                />
              );
            } else if (route.name === 'Search') {
              return (
                <Ionicons
                  name={focused ? 'ios-search' : 'ios-search'}
                  size={size}
                  color={color}
                />
              );
            } else if (route.name ==='Scan'){
              return(
                <MaterialCommunityIcons name={focused ? 'barcode-scan' : 'barcode-scan' } size={size} color={color} />
              )
            } else if (route.name ==='Favorite'){
              return(
                <MaterialIcons name={focused ? 'favorite' : 'favorite-border' } size={size} color={color} />
              )
            } else if (route.name ==='Bookevents'){
              return(
                <MaterialIcons name={focused ? 'event' : 'event' } size={size} color={color} />
              )
            }
          },
        })}       
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
        }}> 
        <Tab.Screen
          name="Home"
          component={Home}
          options={{ title: 'Supernova' }}
        />
        <Tab.Screen name="Search" component={Search} initialParams={{ Passed:"False"}} />
        <Tab.Screen name="Scan" component={Scan} />
        <Tab.Screen name="Favorite" component={Favorite} />
        <Tab.Screen name="Bookevents" component={Bookevents} />
      </Tab.Navigator>
    </NavigationContainer>


  );
};

export default withAuthenticator(App);