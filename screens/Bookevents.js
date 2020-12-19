import * as React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, Linking, View, TextInput, FlatList } from 'react-native';

export default class Bookevents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventsList: [],
      showEvents: [false, false, false, false, false, false, false, false, false, false],
      userState: 'ONLINE',
    };
  }

  componentDidMount() {
    this.fetchData('ONLINE');
  }

  fetchData = async (state) => {
    const api_url =
      'https://booksigningevent.com/wp-json/tribe/events/v1/events/';
    
    const events = []
    if (state !== 'ONLINE'){
      const response = await fetch(api_url+'?per_page=100');
      const data = await response.json();
      for (var i=0 ; i < data.events.length ; i++)
      {
          if (data.events[i].venue.state == state) {
              events.push(data.events[i]);
          }
      }
      this.setState({ eventsList: events});
    }
    else {
       const response = await fetch(api_url+'?venue='+ 3411);
       const data = await response.json();
       this.setState({ eventsList: data.events});
    }
  };

  stateSelect = (stateLetter) => {
      this.setState({userState: stateLetter})
      this.fetchData(stateLetter);
  };

  render() {
    return (
      <View>
        <View>
          <Text style={styles.pageHeader}>Upcoming Events!</Text>
        </View>
        <View style={styles.locationBar}>
          <Text>Enter your state:</Text>
          <TextInput
            style={styles.inputBox}
            placeholder="e.g. NY"
            onChangeText={(value) => this.stateSelect(value.toUpperCase())}
          />
        </View>
        
        <View style={styles.infoText}>
          {this.state.userState == "ONLINE" 
          ? <Text>Here are upcoming online events!</Text>
          : <Text>Here are upcoming events in {this.state.userState}!</Text>}
        </View>

        <View>
          <FlatList
            style={{marginBottom: 250}}
            data={this.state.eventsList}
            extraData={this.state.showEvents}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={
              <View style={styles.infoText2}>
                <Text style={{color: 'red'}}>There are currently no upcoming events, please try again later.</Text>
              </View>
            }
            renderItem={({ item }) => (
              <View>
                <TouchableOpacity onPress={() => {
                  let arr = this.state.showEvents.slice();
                  arr[this.state.eventsList.indexOf(item)] = !(arr[this.state.eventsList.indexOf(item)]);
                  this.setState({ showEvents: arr });
                }}>
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

                {this.state.showEvents[this.state.eventsList.indexOf(item)] &&
                <Text style={styles.eventContent}>
                   
                  {item.description
                    .replace(/&#(\d{4});/gi, '')
                    .replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, '')
                    .replace("&nbsp;", '')
                    .replace("&amp;", '')
                    }
                    {'\n'}
                    <TouchableOpacity onPress={()=>{Linking.openURL(item.url)}}>
                        <Text style={styles.boldText}>Click here for more info! </Text>
                    </TouchableOpacity>
                </Text>}
                
                </TouchableOpacity>

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
    backgroundColor: '#ce796b',
    textAlign: 'center',
    justifyContent: 'center',
    padding: 15,
    fontSize: 20,
    borderWidth: 1,
  },
  eventHeader: {
    backgroundColor: '#e7ad99',
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
    backgroundColor: 'white',
    padding: 10,
  },
  boldText: {
    fontWeight: 'bold',
  },
  locationBar: {
    backgroundColor: 'lightgrey',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
    flexDirection: 'row',
  },
  inputBox: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 8,
    margin: 3,
    width: 75,
    height: 30,
  },
  press: {
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: 'green',
    borderColor: 'black',
    borderRadius: 15,
    borderWidth: 1,
    padding: 2,
    margin: 2,
  },
  infoText: {
    backgroundColor: 'lightgrey',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  infoText2: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
});
