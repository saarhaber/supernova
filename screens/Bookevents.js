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
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View>
                <View style={styles.eventHeader}>

                  <Text style={styles.eventHeaderText}>
                    <Text style={styles.boldText}>Event:</Text>{' '}
                      {item.title
                        .replace(/&#(\d{4};)/gi, '')
                        .replace(/&#(\d{3};)/gi, '')}{'\n'}
                    <Text style={styles.boldText}>Date:</Text>{' '}
                    {item.start_date_details.month}/
                    {item.start_date_details.day}/{item.start_date_details.year}{'\n'}
                    <Text style={styles.boldText}>Location: </Text>
                    {item.venue.venue
                      .replace(/&#(\d{4};)/gi, '')
                      .replace(/&#(\d{3};)/gi, '')}
                  </Text>
                  
                  <Image style={styles.pics} source={{ uri: item.image.url }} />
                  
                </View>

                <Text style={styles.eventContent}>
                  {item.description
                    .replace(/&#(\d{4});/gi, '')
                    .replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, '')}
                </Text>
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
    fontWeight: 'bold',
  },
  eventHeader: {
    backgroundColor: 'skyblue',
    padding: 20,
    borderColor: 'black',
    borderWidth: 1,
    flexDirection: 'row',
  },
  eventHeaderText: {
    flex: 3,
  },
  pics: {
    width: 100,
    height: 100,
  },
  eventContent: {
    backgroundColor: 'lightgrey',
    padding: 10,
    marginBottom: 10,
  },
  boldText: {
    fontWeight: 'bold',
  }
});
