import * as React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, Linking, View, TextInput, FlatList } from 'react-native';
import * as Location from 'expo-location';
import Geocoder from 'react-native-geocoding';

export default class Bookevents extends React.Component {
  constructor(props) {
    super(props);
    Geocoder.init("AIzaSyCJkIgTYX0-lGVkN53U-vYgkqrKkuWoGFU");
    this.state = {
      eventsList: [],
      showEvents: [false, false, false, false, false, false, false, false, false, false],
      userState: 'Online',
      stateLetter:'',
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

  stateSelect = (stateLetter) => {

    let stateCode = 'code';

    if (stateLetter=='AL'){
      stateCode = '3431';
      this.setState({ userState: 'Alabama' });
    }
    else if (stateLetter=='AK'){
      stateCode = '1790';
      this.setState({ userState: 'Alaska' });
    }
    else if (stateLetter=='AZ'){
      stateCode = '10385';
      this.setState({ userState: 'Arizona' });
    }
    else if (stateLetter=='AR'){
      stateCode = '15115';
      this.setState({ userState: 'Arkansas' });
    }
    else if (stateLetter=='CA'){
      stateCode = '1790,10385,15115,15120,19137,20005,20180';
      this.setState({ userState: 'California' });
    }
    else if (stateLetter=='CO'){
      stateCode = '15120';
      this.setState({ userState: 'Colorado' });
    }
    else if (stateLetter=='CT'){
      stateCode = '3632,9303,14181,17237';
      this.setState({ userState: 'Connecticut' });
    }
    else if (stateLetter=='DC'){
      stateCode = '16305';
      this.setState({ userState: 'District of Columbia' });
    }
    else if (stateLetter=='DE'){
      stateCode = '19137';
      this.setState({ userState: 'Delaware' });
    }
    else if (stateLetter=='FL'){
      stateCode = '10639,11231';
      this.setState({ userState: 'Florida' });
    }
    else if (stateLetter=='GA'){
      stateCode = '1724,10469,17132';
      this.setState({ userState: 'Georgia' });
    }
    else if (stateLetter=='HI'){
      stateCode = '1790';
      this.setState({ userState: 'Hawaii' });
    }
    else if (stateLetter=='IA'){
      stateCode = '11000,11895';
      this.setState({ userState: 'Iowa' });
    }
    else if (stateLetter=='ID'){
      stateCode = '10385';
      this.setState({ userState: 'Idaho' });
    }
    else if (stateLetter=='IL'){
      stateCode = '10449,12942,17162';
      this.setState({ userState: 'Illinois' });
    }
    else if (stateLetter=='IN'){
      stateCode = '15115';
      this.setState({ userState: 'Indiana' });
    }
    else if (stateLetter=='KS'){
      stateCode = '11329,15899';
      this.setState({ userState: 'Kansas' });
    }
    else if (stateLetter=='KY'){
      stateCode = '11485,15108';
      this.setState({ userState: 'Kentucky' });
    }
    else if (stateLetter=='LA'){
      stateCode = '15120';
      this.setState({ userState: 'Louisiana' });
    }
    else if (stateLetter=='MA'){
      stateCode = '3270,17120';
      this.setState({ userState: 'Massachusetts' });
    }
    else if (stateLetter=='MD'){
      stateCode = '11177,16467';
      this.setState({ userState: 'Maryland' });
    }
    else if (stateLetter=='ME'){
      stateCode = '19220';
      this.setState({ userState: 'Maine' });
    }
    else if (stateLetter=='MI'){
      stateCode = '16784';
      this.setState({ userState: 'Michigan' });
    }
    else if (stateLetter=='MN'){
      stateCode = '3407,11011';
      this.setState({ userState: 'Minnesota' });
    }
    else if (stateLetter=='MO'){
      stateCode = '6855';
      this.setState({ userState: 'Missouri' });
    }
    else if (stateLetter=='MS'){
      stateCode = '19137';
      this.setState({ userState: 'Mississippi' });
    }
    else if (stateLetter=='MT'){
      stateCode = '1790';
      this.setState({ userState: 'Montana' });
    }
    else if (stateLetter=='NC'){
      stateCode = '2064,16199';
      this.setState({ userState: 'North Carolina' });
    }
    else if (stateLetter=='ND'){
      stateCode = '13199';
      this.setState({ userState: 'North Dakota' });
    }
    else if (stateLetter=='NE'){
      stateCode = '10385';
      this.setState({ userState: 'Nebraska' });
    }
    else if (stateLetter=='NH'){
      stateCode = '15115';
      this.setState({ userState: 'New Hampshire' });
    }
    else if (stateLetter=='NJ'){
      stateCode = '1843,2123,14180';
      this.setState({ userState: 'New Jersey' });
    }
    else if (stateLetter=='NM'){
      stateCode = '15120';
      this.setState({ userState: 'New Mexico' });
    }
    else if (stateLetter=='NV'){
      stateCode = '3483';
      this.setState({ userState: 'Nevada' });
    }
    else if (stateLetter=='NY'){
      stateCode = '2745,3508,9508,14179,16767,16797';
      this.setState({ userState: 'New York' });
    }
    else if (stateLetter=='OH'){
      stateCode = '16106';
      this.setState({ userState: 'Ohio' });
    }
    else if (stateLetter=='OK'){
      stateCode = '16193';
      this.setState({ userState: 'Oklahoma' });
    }
    else if (stateLetter=='OR'){
       stateCode = '10997';
       this.setState({ userState: 'Oregon' });
    }
    else if (stateLetter=='PA'){
      stateCode = '13489,15636,19949';
      this.setState({ userState: 'Pennsylvania' });
    }
    else if (stateLetter=='RI'){
      stateCode = '13407,15889,15890';
      this.setState({ userState: 'Rhode Island' });
    }
    else if (stateLetter=='SC'){
      stateCode = '13407,15889,15890';
      this.setState({ userState: 'South Carolina' });
    }
    else if (stateLetter=='SD'){
      stateCode = '19137';
      this.setState({ userState: 'South Dakota' });
    }
    else if (stateLetter=='TN'){
      stateCode = '17123,17127,20333';
      this.setState({ userState: 'Tennessee' });
    }
    else if (stateLetter=='TX'){
      stateCode = '2536,14177,14178,16915,18950,19960';
      this.setState({ userState: 'Texas' });
    }
    else if (stateLetter=='UT'){
      stateCode = '15896';
      this.setState({ userState: 'Utah' });
    }
    else if (stateLetter=='VA'){
      stateCode = '18969,20129';
      this.setState({ userState: 'Virginia' });
    }
    else if (stateLetter=='VT'){
      stateCode = '1790';
      this.setState({ userState: 'Vermont' });
    }
    else if (stateLetter=='WA'){
      stateCode = '10620';
      this.setState({ userState: 'Washington' });
    }
    else if (stateLetter=='WV'){
      stateCode = '10385';
      this.setState({ userState: 'West Virginia' });
    }
    else if (stateLetter=='WI'){
      stateCode = '16647,17220,17234';
      this.setState({ userState: 'Wisconsin' });
    }
    else if (stateLetter=='WY'){
      stateCode = '15115';
      this.setState({ userState: 'Wyoming' });
    }
    else if (stateLetter=='ONLINE'){
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
      let location = await Location.getCurrentPositionAsync({});
      this.setState({ userLoc: location });
      let lat = this.state.userLoc.coords.latitude
      let long = this.state.userLoc.coords.longitude
      Geocoder.from({
        latitude : lat,
        longitude : long
      }).then(json => {
        this.stateSelect(json.results[0].address_components[4].short_name)
      })
        .catch(error => console.warn(error));
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
                    .replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, '')}
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
