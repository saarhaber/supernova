import * as React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, Button, TextInput, ScrollView, FlatList, Alert } from 'react-native';
import * as Location from 'expo-location';

export default class Bookevents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventsList: [],
      showEvents: [false, false, false, false, false, false, false, false, false, false],
      userState: 'Online',
      userLoc: {},
      permissionGranted: false,
      errorMessage: 'unchanged',
    };
  }

  componentDidMount() {
    this.fetchData('3411');
  }

  fetchData = async (code) => {
    const api_url =
      'https://booksigningevent.com/wp-json/tribe/events/v1/events/';
    const response = await fetch(api_url+'?venue='+code);
    const data = await response.json();
    this.setState({ eventsList: data.events });
  };

  stateSelect = (state) => {
    let stateCode = 'code';

    if (state=='GPS'){
      state = this.state.userLoc.toString();
    }

    if (state=='AL'){
      stateCode = '3431';
      this.setState({ userState: 'Alabama' });
    }
    else if (state=='AK'){
      stateCode = '1790';
      this.setState({ userState: 'Alaska' });
    }
    else if (state=='AZ'){
      stateCode = '10385';
      this.setState({ userState: 'Arizona' });
    }
    else if (state=='AR'){
      stateCode = '15115';
      this.setState({ userState: 'Arkansas' });
    }
    else if (state=='CA'){
      stateCode = '1790,10385,15115,15120,19137,20005,20180';
      this.setState({ userState: 'California' });
    }
    else if (state=='CO'){
      stateCode = '15120';
      this.setState({ userState: 'Colorado' });
    }
    else if (state=='CT'){
      stateCode = '3632,9303,14181,17237';
      this.setState({ userState: 'Connecticut' });
    }
    else if (state=='DC'){
      stateCode = '16305';
      this.setState({ userState: 'District of Columbia' });
    }
    else if (state=='DE'){
      stateCode = '19137';
      this.setState({ userState: 'Delaware' });
    }
    else if (state=='FL'){
      stateCode = '10639,11231';
      this.setState({ userState: 'Florida' });
    }
    else if (state=='GA'){
      stateCode = '1724,10469,17132';
      this.setState({ userState: 'Georgia' });
    }
    else if (state=='HI'){
      stateCode = '1790';
      this.setState({ userState: 'Hawaii' });
    }
    else if (state=='IA'){
      stateCode = '11000,11895';
      this.setState({ userState: 'Iowa' });
    }
    else if (state=='ID'){
      stateCode = '10385';
      this.setState({ userState: 'Idaho' });
    }
    else if (state=='IL'){
      stateCode = '10449,12942,17162';
      this.setState({ userState: 'Illinois' });
    }
    else if (state=='IN'){
      stateCode = '15115';
      this.setState({ userState: 'Indiana' });
    }
    else if (state=='KS'){
      stateCode = '11329,15899';
      this.setState({ userState: 'Kansas' });
    }
    else if (state=='KY'){
      stateCode = '11485,15108';
      this.setState({ userState: 'Kentucky' });
    }
    else if (state=='LA'){
      stateCode = '15120';
      this.setState({ userState: 'Louisiana' });
    }
    else if (state=='MA'){
      stateCode = '3270,17120';
      this.setState({ userState: 'Massachusetts' });
    }
    else if (state=='MD'){
      stateCode = '11177,16467';
      this.setState({ userState: 'Maryland' });
    }
    else if (state=='ME'){
      stateCode = '19220';
      this.setState({ userState: 'Maine' });
    }
    else if (state=='MI'){
      stateCode = '16784';
      this.setState({ userState: 'Michigan' });
    }
    else if (state=='MN'){
      stateCode = '3407,11011';
      this.setState({ userState: 'Minnesota' });
    }
    else if (state=='MO'){
      stateCode = '6855';
      this.setState({ userState: 'Missouri' });
    }
    else if (state=='MS'){
      stateCode = '19137';
      this.setState({ userState: 'Mississippi' });
    }
    else if (state=='MT'){
      stateCode = '1790';
      this.setState({ userState: 'Montana' });
    }
    else if (state=='NC'){
      stateCode = '2064,16199';
      this.setState({ userState: 'North Carolina' });
    }
    else if (state=='ND'){
      stateCode = '13199';
      this.setState({ userState: 'North Dakota' });
    }
    else if (state=='NE'){
      stateCode = '10385';
      this.setState({ userState: 'Nebraska' });
    }
    else if (state=='NH'){
      stateCode = '15115';
      this.setState({ userState: 'New Hampshire' });
    }
    else if (state=='NJ'){
      stateCode = '1843,2123,14180';
      this.setState({ userState: 'New Jersey' });
    }
    else if (state=='NM'){
      stateCode = '15120';
      this.setState({ userState: 'New Mexico' });
    }
    else if (state=='NV'){
      stateCode = '3483';
      this.setState({ userState: 'Nevada' });
    }
    else if (state=='NY'||state=='gps'){
      stateCode = '2745,3508,9508,14179,16767,16797';
      this.setState({ userState: 'New York' });
    }
    else if (state=='OH'){
      stateCode = '16106';
      this.setState({ userState: 'Ohio' });
    }
    else if (state=='OK'){
      stateCode = '16193';
      this.setState({ userState: 'Oklahoma' });
    }
    else if (state=='OR'){
       stateCode = '10997';
       this.setState({ userState: 'Oregon' });
    }
    else if (state=='PA'){
      stateCode = '13489,15636,19949';
      this.setState({ userState: 'Pennsylvania' });
    }
    else if (state=='RI'){
      stateCode = '13407,15889,15890';
      this.setState({ userState: 'Rhode Island' });
    }
    else if (state=='SC'){
      stateCode = '13407,15889,15890';
      this.setState({ userState: 'South Carolina' });
    }
    else if (state=='SD'){
      stateCode = '19137';
      this.setState({ userState: 'South Dakota' });
    }
    else if (state=='TN'){
      stateCode = '17123,17127,20333';
      this.setState({ userState: 'Tennessee' });
    }
    else if (state=='TX'){
      stateCode = '2536,14177,14178,16915,18950,19960';
      this.setState({ userState: 'Texas' });
    }
    else if (state=='UT'){
      stateCode = '15896';
      this.setState({ userState: 'Utah' });
    }
    else if (state=='VA'){
      stateCode = '18969,20129';
      this.setState({ userState: 'Virginia' });
    }
    else if (state=='VT'){
      stateCode = '1790';
      this.setState({ userState: 'Vermont' });
    }
    else if (state=='WA'){
      stateCode = '10620';
      this.setState({ userState: 'Washington' });
    }
    else if (state=='WV'){
      stateCode = '10385';
      this.setState({ userState: 'West Virginia' });
    }
    else if (state=='WI'){
      stateCode = '16647,17220,17234';
      this.setState({ userState: 'Wisconsin' });
    }
    else if (state=='WY'){
      stateCode = '15115';
      this.setState({ userState: 'Wyoming' });
    }
    else if (state=='ONLINE'){
      stateCode = '3411';
      this.setState({ userState: 'Online' });
    }

    if(stateCode!='code'){
      this.fetchData(stateCode);
    }
  };

  PressGPS = async () => {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
      this.setState({ errorMessage: 'Permission to access location was denied' });
    } 
    else {
      this.setState({ permissionGranted: true });
      this.setState({ errorMessage: 'Permission to access location was granted' });
      this.stateSelect('gps');
      let location = await Location.getCurrentPositionAsync({});
      this.setState({ userLoc: location });
    }
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
          <Text> or </Text>
          <TouchableOpacity onPress={() => this.PressGPS()}>
            <Text style={styles.press}> Use GPS </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.infoText}>
          {this.state.userState == "Online" 
          ? <Text >Here are upcoming online events!</Text>
          : <Text >Here are upcoming events in {this.state.userState}!</Text>}
        </View>

        <View>
          <FlatList
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

                {this.state.showEvents[this.state.eventsList.indexOf(item)] && <Text style={styles.eventContent}>
                  {item.description
                    .replace(/&#(\d{4});/gi, '')
                    .replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, '')}
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
    marginBottom: 5,
  },
  boldText: {
    fontWeight: 'bold',
  },
  locationBar: {
    backgroundColor: 'lightgray',
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
    backgroundColor: 'lightgray',
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
