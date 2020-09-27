import * as React from 'react';
import { Button, View, Text, ScrollView, Dimensions} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

/*
key: l2sRuWFpQfI2HFPSm96ZmQ
secret: 65YExjsKFQJaDmsuFmT7aRcVbpvTgMcIABO49lxM3NE
*/

class Search extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            key:"l2sRuWFpQfI2HFPSm96ZmQ",
            inputIsbn: '',
            reviews: null
        }
    }
    
    handleSubmit() {
        fetch(`https://www.goodreads.com/book/isbn/${this.inputIsbn}.json?key=${this.key}`, {
            method: 'GET'
        })
          .then ((response) => response.text())
          .then ((json) => {
              console.log(json)
            //   this.setState({reviews: json.book.reviews_widget});
          })
            .catch((err) => {
                console.log(err);
            });
    }


    render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Search Page</Text>
        <TextInput placeholder = {"Enter ISBN number"}
        onChangeText={(text) => this.setState({inputIsbn: text})}></TextInput>
        <Button
          title="Submit"
          onPress={() =>  this.handleSubmit()}
        />
        <Button
          title="Home"
          onPress={() => this.props.navigation.navigate('Home')}
        />
        <View>
            <Text>{this.state.reviews}</Text>
        </View>
      </View>
       
    );
  }
}
export default Search;