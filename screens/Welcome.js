import * as React from 'react';
import { Text, View, StyleSheet, ImageBackground } from 'react-native';

export default class Welcome extends React.Component {
  render() {
    return (
      <ImageBackground
        source={{ uri: 'https://cutewallpaper.org/21/wallpapers-night-sky/Red-sky-at-night-Ringtones-and-Wallpapers-Free-by-ZEDGE_tm_.jpg' }}
        style={styles.bgImage}>
        <View style={styles.container}>
          <Text style={styles.title}>
            <Text style={{ fontWeight: 'bold', fontSize: 25 }}>
              Welcome to
              <Text style={{ fontStyle: 'italic', color: 'orange' }}>{' '}Supernova</Text>
            </Text>
            {'\n'}
            The mobile app for book lovers!
          </Text>
          <Text style={styles.paragraph}>
            Our aim is to expedite the book buying decision making process by
            offering you a way to view a book{"'"}s reviews simply by scanning
            it. This will make your experience much easier and save you
            countless hours!{'\n'}
            We would also like to offer you a way to stay informed and up to
            date with the latest book news. You can do so by checking the New
            York Times Best Sellers List or the List of Upcoming Book Signing
            Events{'\n'}{'\n'}
            <Text style={styles.end}>
              Explore the amazing features of Supernova by using the tab bar below!
            </Text>
          </Text>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  title: {
    margin: 20,
    fontSize: 18,
    textAlign: 'center',
    color: 'white',
  },
  paragraph: {
    color: 'white',
  },
  end: {
    fontWeight: 'bold'
  },
  bgImage: {
    flex: 1,
    justifyContent: 'center',
  },
});
