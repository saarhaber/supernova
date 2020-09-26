import * as React from 'react';
import { Button, View, Text } from 'react-native';

/*
key: l2sRuWFpQfI2HFPSm96ZmQ
secret: 65YExjsKFQJaDmsuFmT7aRcVbpvTgMcIABO49lxM3NE
*/

class Search extends React.Component {
    render()
    {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Search Page</Text>
        <Button
          title="Home"
          onPress={() => this.props.navigation.navigate('Home')}
        />
      </View>
    );
  }
}
export default Search;