import * as React from 'react';
import { Button, View, Text} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import {Card} from 'react-native-shadow-cards';



class Search extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            key:"9d36aa03f3dab521f27f0c7fc737698dbe01df70", //iDreamsBooks
            inputIsbn: '',
            reviews: [],
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleSubmit() {
      this.setState({reviews: 
          fetch(`http://idreambooks.com/api/books/reviews.json?q=${this.state.inputIsbn}&key=${this.state.key}`, {
            method: 'GET'
        })
          .then (response => response.json() )
          .then (res => {
              console.log("returned: ", (res))
              return res;
          })
            .catch( err => {
                console.log(err);
            })
          })
    }

    hanldeLog() {
      console.log (this.state.reviews);
    }


    render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Search Page</Text>
        <Button
          title="Home"
          type="button"
          onPress={() => this.props.navigation.navigate('Home')}
        />
        <View>
      <Card style={{padding: 10, margin: 10}}>
      <TextInput placeholder = {"Enter ISBN number"}
        onChangeText={(text) => this.setState({inputIsbn: text})}></TextInput>
      </Card>
      <Card style={{padding: 10, margin: 10}}>
      <Button
          title="Submit"
          onPress={() =>  this.handleSubmit()}
        />
      </Card>
      <Card>
    <Text>{this.state.reviews[0] ? this.state.reviews[0].snippet : "hi"}</Text>
    <Button
          title="log"
          onPress={() =>  this.hanldeLog()}
        />
      </Card>
    </View>
      </View>
    );
  }
}

export default Search;