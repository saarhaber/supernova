import React from 'react';
import { Button, StyleSheet, Text, View, TextInput } from 'react-native';

export default function App() {
  return (
    <View style={{padding: 50}}>
      <View>
        <TextInput placeholder="NYT Best Sellers" style={{padding: 10, fontSize: 30, textAlign: "center"}}/>
      </View>
      <View >
        <Button title="History" />
        <Button title="Scan" />
        <Button title="Favorite" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
 
});
