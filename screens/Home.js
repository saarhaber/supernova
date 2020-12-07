import * as React from 'react';
import { Button, View, Text, Image, Linking, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import {Card} from 'react-native-shadow-cards';
import { API  } from "aws-amplify"
import * as mutations from '../graphql/mutations';

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        keyNYT:"orP8vrQNvABHG8kLlAsk4cdfgOJ6A46p",
        keyGG: "AIzaSyCJkIgTYX0-lGVkN53U-vYgkqrKkuWoGFU",
        best: ''
    }
}

async handleFavorite(item){
  try{
  const bookDetails = {
    name: item.title,
    description: `By ${item.author}`
  };
  const newBook = await API.graphql({ query: mutations.createBook, variables: {input: bookDetails}});
}
catch (err) {
  console.log('error creating book:', err)
  }
}

  componentDidMount() {
    fetch(`https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=${this.state.keyNYT}`,
    {    method: 'get'  })
    .then(response => response.json())
    .then (json => this.setState({best : json.results}))
    .then (console.log(this.state.best))
    .catch( err => {
        console.log(err);
    })
}

    render ()
    {
    return (
      <View>
      <View style={{marginTop: 60, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={styles.head}>New York Times Best Sellers List</Text>
      </View>
      <View>
      <FlatList style={styles.list}
          data={this.state.best.books}
          keyExtractor={item => item.rank.toString()}
          renderItem={({ item }) => (
          <Card style={styles.card}>
            <TouchableOpacity  style={styles.title}>
          <Text style={styles.source}>{item.rank}. {item.title}{'\n'}by {item.author}</Text>
            </TouchableOpacity>
            <View style={styles.picAnd}>
              <Image style={styles.pic} source={{uri: item.book_image}} />
              <Text style={styles.snippet}>{item.description}</Text>
            </View>
            <View>
            <Button title="Add To Favorites" onPress={() => this.handleFavorite(item)}/> 
          </View>
          </Card>
          )}
      />
      </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  head: {
    fontSize: 20,
  },
  pic: {
    width: 60,
    height: 100,
  },
  picAnd: {
    flexDirection: "row",
  },
  card: {
    backgroundColor: '#e7ad99',
    marginTop: 10,
    padding: 5
  },
  snippet: {
    backgroundColor: '#ce796b',
    marginRight: 70,
    marginLeft: 5,
    fontSize: 15
  },
  title: {
    justifyContent: "space-between",
    borderBottomWidth: 1,
  },
  source: {
    fontSize: 17,
  },
  list: {
    marginBottom: 180,
    marginLeft: 18,
  }
});


export default Home;