import * as React from 'react';
import { Button, View, ScrollView,SafeAreaView, Text, FlatList, StyleSheet, Linking, TouchableOpacity} from 'react-native';
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
        
    }

  //   renderReviewsInfo(){
  //     return(
  //         < ScrollView>
  //             <FlatList
  //                 data={this.state.reviews}
  //                 keyExtractor={item => item.source.toString()}
  //                 renderItem={({ item }) => (
  //                 <Card style={styles.card}>
  //                   <TouchableOpacity  style={styles.title} onPress={()=>{Linking.openURL(item.review_link)}}>
  //                 <Text style={styles.source}> {item.source}  {item.star_rating}/5  {item.review_date}</Text>
  //                   <Text style={styles.more}>read full review</Text>
  //                   </TouchableOpacity>
  //                   <Text style={styles.snippet}>{item.snippet}</Text>
  //                 </Card>
  //                 )}
  //             />
  //         </ScrollView>
  //     )
  // }

  render() {
    
    return (
      <View  style={{ alignItems: 'center', justifyContent: 'center', marginTop: 100}}>
        <View >
      <Card style={{padding: 10,  }}>
      <TextInput placeholder = {"Enter ISBN number"}
        onChangeText={(text) => this.setState({inputIsbn: text})}></TextInput>
      </Card></View>
      <View>
      <Card style={{padding: 10, margin: 10}}>
      <Button
          title="Submit"
          onPress={() =>  this.handleSubmit()}
        />
      </Card>
              <FlatList
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
    marginBottom: 10
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