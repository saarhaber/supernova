import * as React from 'react';
import { Button, View, Text, FlatList, StyleSheet, Linking, Image, TouchableOpacity} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import {Card} from 'react-native-shadow-cards';
import { API  } from "aws-amplify"
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
            imgLink: "",
            buyLink: "",
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


    async handleSubmit(scannedData) {
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
              this.setState({title:"", author:""})
                console.log(err);
            })
              await fetch(`https://www.googleapis.com/books/v1/volumes?q=${this.state.inputIsbn}`, {
            method: 'GET'
        })
          .then (response => response.json() )
          .then (res => {
              this.setState({imgLink: res.items[0].volumeInfo.imageLinks.thumbnail, buyLink:res.items[0].saleInfo.buyLink})
          })
            .catch( err => {
                console.log(err);
            })
        }
        else if(scannedData != "False" && scannedData.data){
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
              this.setState({book: res.book, title:res.book.title, author:res.book.author})
          })
            .catch( err => {
              this.setState({title:"", author:"", reviews:""})
                console.log(err);
            })
              await fetch(`https://www.googleapis.com/books/v1/volumes?q=${scannedData.data}`, {
          method: 'GET'
      })
        .then (response => response.json() )
        .then (res => {
            this.setState({imgLink: res.items[0].volumeInfo.imageLinks.thumbnail, buyLink:res.items[0].saleInfo.buyLink})
        })
          .catch( err => {
              console.log(err);
          })
        }

        if (!this.state.title && this.state.inputIsbn!='') {
          await fetch(`https://www.googleapis.com/books/v1/volumes?q=${this.state.inputIsbn}`, {
            method: 'GET'
        })
          .then (response => response.json() )
          .then (res => {
              this.setState({title: res.items[0].volumeInfo.title, author: res.items[0].volumeInfo.authors[0],
                imgLink: res.items[0].volumeInfo.imageLinks.thumbnail, buyLink:res.items[0].saleInfo.buyLink})
          })
            .catch( err => {
                console.log(err);
            })
        }
        this.setState({inputIsbn: ''})
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
          title="Search"
          onPress={() => this.handleSubmit(this.state.inputIsbn)}
        />
        <Button
          title="Submit Scan"
          onPress={() =>  this.handleSubmit(Passed)}
        />
      <Button title = "ISBN Scan" onPress={() => this.props.navigation.navigate('Scan')}/>
      </Card>

      {this.state.title ? <Card style={styles.card}>
        <View style={styles.picAnd}>
          { this.state.imgLink ? <Image style={styles.pic} source={{uri: this.state.imgLink}}/> : null}
          <Text style={styles.title}>{this.state.title}{'\n'}By {this.state.author}</Text>
          </View>
          {this.state.buyLink ?<TouchableOpacity style={styles.title} onPress={()=>{Linking.openURL(this.state.buyLink)}}>
            <Text style={styles.more}>Cick here to buy the eBook! </Text>
          </TouchableOpacity> : null}
          {(!this.state.reviews || this.state.reviews==[] || this.state.reviews=="") ?
          <Text style={styles.more} >No critcis' reviews found for this book!</Text> : null}
        <Button
                title="Add To Favorites"
                onPress={() => this.handleFavorite()}/>
      </Card>  : null }

      <FlatList
          style= {{marginBottom: 50}}
          data={this.state.reviews}
          keyExtractor={item => item.source.toString()}
          renderItem={({ item }) => (
          <Card style={styles.card}>
            <TouchableOpacity  style={styles.title} onPress={()=>{Linking.openURL(item.review_link)}}>
          <Text style={styles.source}>{item.source}  {item.star_rating}/5</Text>
            <Text style={styles.more}>Click for full review! </Text>
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
    padding: 2
  },
  snippet: {
    backgroundColor: '#ce796b',
    padding: 5,
  },
  title: {
    justifyContent: "space-between",
    padding: 1,
    fontSize: 20,
    marginRight: 50
  },
  source: {
    fontSize: 17,
  },
  pic: {
    width: 60,
    height: 100,
    margin: 1
  },
    picAnd: {
    flexDirection: "row",
  },
  more: {
    fontSize: 13,
    fontStyle: "italic",
  }
});

export default Search;