import * as React from 'react';
import { Button, View, Text } from 'react-native';

class Home extends React.Component {
    render ()
    {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Page</Text>
        <Button
          title="Search"
          onPress={() => this.props.navigation.navigate('Search')}
        />
        <Button
          title="Favorite"
          onPress={() => this.props.navigation.navigate('Favorite')}
        />
        <Button
          title="Bookevents"
          onPress={() => this.props.navigation.navigate('Bookevents')}
        />
        <Button
          title="Scan"
          onPress={() => this.props.navigation.navigate('Scan')}
        />
      </View>
    );
  }
}
export default Home;