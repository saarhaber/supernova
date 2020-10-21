import * as React from 'react';
import { Button, View, Text, Linking, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import {Card} from 'react-native-shadow-cards';

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        keyNYT:"orP8vrQNvABHG8kLlAsk4cdfgOJ6A46p",
        keyGG: "",
        best: ''
    }
}

  getList() {
    fetch(`https://api.nytimes.com/svc/books/v3/lists.json?list-name=hardcover-fiction&api-key=${this.state.keyNYT}`,
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
      <View style={{marginTop: 100, alignItems: 'center', justifyContent: 'center' }}>
        <Text>New York Times Best Sellers List</Text>
        <Button title="get list" onPress={()=> this.getList()}/>
      </View>
      <View>
      <FlatList style={styles.list}
          data={this.state.best}
          keyExtractor={item => item.rank.toString()}
          renderItem={({ item }) => (
          <Card style={styles.card}>
            <TouchableOpacity  style={styles.title}>
          <Text style={styles.source}>{item.rank}. {item.book_details[0].title}{'\n'}by {item.book_details[0].author}</Text>
            </TouchableOpacity>
            <Text style={styles.snippet}> picture goes here</Text>
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
    padding: 5
  },
  snippet: {
    backgroundColor: '#ce796b',
    padding: 5,
  },
  title: {
    justifyContent: "space-between",
    borderBottomWidth: 1,
  },
  source: {
    fontSize: 14,
  },
  list: {
    marginBottom: 330,
    marginLeft: 15,
  }
});


export default Home;