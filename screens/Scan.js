import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Image } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function App({navigation}) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };
  function AfterScanned(){
    setScanned(false);
    navigation.navigate('Search');
  }

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View
    style={{
    flex: 1,
    flexDirection: 'column',
    }}>
    <BarCodeScanner
      onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      style={StyleSheet.absoluteFillObject}
    />
    <View style = {{alignItems:'center',padding:100}}>
    <Image style = {{width:500 ,height:500 }} source = {{uri:'https://i.stack.imgur.com/VVqSa.png'}}/>
    </View>
    <View style = {{flex:1,flexDirection:'column',justifyContent:'space-evenly'}}>
    {scanned && <Button title={'Tap to Go Back'} onPress={() => AfterScanned()} />}
    </View>
    </View>
  );
}