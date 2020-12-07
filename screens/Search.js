import * as React from 'react';
import { Button, View, Text, FlatList, StyleSheet, Linking, TouchableOpacity} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import {Card} from 'react-native-shadow-cards';
import { API, graphqlOperation  } from "aws-amplify"
import { listBooks } from '../graphql/queries'
import * as mutations from '../graphql/mutations';


class Search extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            key:"9d36aa03f3dab521f27f0c7fc737698dbe01df70", //iDreamsBooks
            inputIsbn: '',
            reviews: [],
            book: "",
            by: 'By ',
            author: "",
            title: "",
            placeholder: "Enter ISBN number",
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    async handleFavorite(){
      try{
      const bookDetails = {
        name: `${this.state.title}`,
        description: `By ${this.state.author}`
      };
      const newBook = await API.graphql({ query: mutations.createBook, variables: {input: bookDetails}});
    }
    catch (err) {
      console.log('error creating book:', err)
      }
    }


    handleSubmit(scannedData) {
        if (this.state.inputIsbn!=''){
          fetch(`http://idreambooks.com/api/books/reviews.json?q=${this.state.inputIsbn}&key=${this.state.key}`, {
            method: 'GET'
        })
          .then (response => response.json() )
          .then (res => {
              this.setState({reviews: res.book.critic_reviews})
          })
            .catch( err => {
                console.log(err);
            })

          fetch(`http://idreambooks.com/api/books/reviews.json?q=${this.state.inputIsbn}&key=${this.state.key}`, {
            method: 'GET'
        })
          .then (response => response.json() )
          .then (res => {
              this.setState({book: res.book, title:res.book.title, author:res.book.author})
          })
            .catch( err => {
                console.log(err);
            })
            this.setState({inputIsbn:''})
        }
        else if(scannedData != "False"){
          this.setState({inputIsbn: scannedData.data})
          fetch(`http://idreambooks.com/api/books/reviews.json?q=${scannedData.data}&key=${this.state.key}`, {
            method: 'GET'
        })
          .then (response => response.json() )
          .then (res => {
              this.setState({reviews: res.book.critic_reviews})
          })
            .catch( err => {
                console.log(err);
            })

          fetch(`http://idreambooks.com/api/books/reviews.json?q=${scannedData.data}&key=${this.state.key}`, {
            method: 'GET'
        })
          .then (response => response.json() )
          .then (res => {
              this.setState({book: res.book})
          })
            .catch( err => {
                console.log(err);
            })
        }
    }

  render() {
    const {Passed} = this.props.route.params;
    return (
      <View  style={{ alignItems: 'center', justifyContent: 'center', marginTop: 40}}>
        <View >
      <Card style={{padding: 10,  }}>
      <TextInput placeholder = {this.state.placeholder} 
        onChangeText={(text) => this.setState({inputIsbn: text})}>
        </TextInput>
      </Card></View>
      <View>
      <Card style={{padding: 10, margin: 10,flexDirection:'row',justifyContent:'space-evenly'}}>
      <Button
          title="Submit"
          onPress={() =>  this.handleSubmit(Passed)}
        />
      <Button title = "ISBN Scan" onPress={() => this.props.navigation.navigate('Scan')}/>
      </Card>
      <View >
    <Text style={this.state.book ? styles.title : null}>{this.state.book.title}</Text>
    <Text style={this.state.book ? styles.title : null}>{this.state.book.author ? (this.state.by + this.state.book.author) : null} </Text>
    {this.state.title ? <Button
          title="Add To Favorites"
          onPress={() => this.handleFavorite()}
        /> : null }
      </View>
      <FlatList
          style= {{marginBottom: 50}}
          data={this.state.reviews}
          keyExtractor={item => item.source.toString()}
          renderItem={({ item }) => (
          <Card style={styles.card}>
            <TouchableOpacity  style={styles.title} onPress={()=>{Linking.openURL(item.review_link)}}>
          <Text style={styles.source}> {item.source}  {item.star_rating}/5</Text>
            <Text style={styles.more}>read full review</Text>
            </TouchableOpacity>
            <Text style={styles.snippet}>{item.snippet}</Text>
          </Card>
          )}
      />
    </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  card: {
    backgroundColor: '#e7ad99',
    marginTop: 10,

  },
  snippet: {
    backgroundColor: '#ce796b',
    padding: 5,
  },
  title: {
    justifyContent: "space-between",
    flexDirection: "row",
    borderBottomWidth: 1,
    alignItems: "flex-end"
  },
  source: {
    fontSize: 15,
  },
  more: {
    fontSize: 13,
    fontStyle: "italic",
  }
});

export default Search;