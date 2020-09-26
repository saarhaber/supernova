import * as React from 'react';
import { Button, View, Text } from 'react-native';

class Favorite extends React.Component {
    render()
    {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Favorite Page</Text>
        <Button
          title="Home"
          onPress={() => this.props.navigation.navigate('Home')}
        />
      </View>
    );
  }
}
export default Favorite;