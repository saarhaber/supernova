import * as React from 'react';
import { Button, View, Text } from 'react-native';

class Bookevents extends React.Component {
    render()
    {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Book Signing Events Page</Text>
        <Button
          title="Home"
          onPress={() => this.props.navigation.navigate('Home')}
        />
      </View>
    );
  }
}
export default Bookevents;