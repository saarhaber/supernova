import * as React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, Button, TextInput, ScrollView, FlatList, Alert } from 'react-native';

export default class Bookevents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventsList: [],
    };
  }

  componentDidMount() {
    this.fetchData();
  }
  fetchData = async () => {
    const api_url =
      'https://booksigningevent.com/wp-json/tribe/events/v1/events';
    const response = await fetch(api_url);
    const data = await response.json();
    this.setState({ eventsList: data.events });
  };

  render() {
    return (
      <View>

        <View>
          <Text style={styles.pageHeader}>Upcoming Events!</Text>
        </View>

        <View>
          <FlatList
            data={this.state.eventsList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View>
                <Text style={styles.eventHeader}>
                  <Image style={styles.pics} source={{ uri: item.image.url }} />
                  <Text style={styles.boldText}>{item.title})</Text>
                  {'\n'}
                  <Text style={styles.boldText}>Date: </Text>{item.start_date}
                  {'\n'}
                  <Text style={styles.boldText}>Location: </Text>{item.venue.venue}
                </Text>
                <Text style={styles.eventContent}>{item.description}</Text>
              </View>
            )}
          />
        </View>        
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  pageHeader: {
    color: 'white',
    backgroundColor: 'black',
    textAlign: 'center',
    padding: 20,
    fontSize: 20,
    borderWidth: 1,
    marginBottom: 10,
  },
  eventHeader: {
    backgroundColor: 'skyblue',
    padding: 20,
    borderColor: 'black',
    borderWidth: 1,
  },
  eventContent: {
    backgroundColor: 'lightgrey',
    padding: 10,
    marginBottom: 10,
  },
  pics: {
    width: 75,
    height: 75,
    marginLeft: 5,
    float: 'right',
  },
  boldText: {
    fontWeight: 'bold',
  },
});


