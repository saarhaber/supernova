import * as React from 'react';
import { Button, View, Text, ScrollView, Dimensions} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';


class Search extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            key:"9d36aa03f3dab521f27f0c7fc737698dbe01df70", //iDreamsBooks
            inputIsbn: '',
            reviews: null
        }
    }
    
    handleSubmit() {
        this.setState({reviews:
        fetch(`http://idreambooks.com/api/books/reviews.json?q=${this.state.inputIsbn}&key=${this.state.key}`, {
            method: 'GET'
        })
          .then ((response) => response.json())
          .then ((json) => {
              console.log(json.book.critic_reviews)
              return json.book.critic_reviews;
          })
            .catch((err) => {
                console.log(err);
            })
        })
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
            {/*<Text>{this.state.reviews}</Text>*/}
        </View>
      </View>
       
    );
  }
}
export default Search;