import React from 'react';

import { useEffect, useState } from 'react'
import {Card} from 'react-native-shadow-cards';

import {Image, Linking, TouchableOpacity, View, Text, StyleSheet, Button, FlatList } from 'react-native'
import { API, graphqlOperation } from 'aws-amplify'
import { deleteBook } from '../graphql/mutations'
import { listBooks } from '../graphql/queries'

const initialState = { name: '', description: '', link: '', image: '' }

const Favorite = () => {
  const [formState, setFormState] = useState(initialState)
  const [books, setBooks] = useState([])

  useEffect(() => {
    fetchBooks()
  }, [])

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value })
  }

  async function fetchBooks() {
    try {
      const bookData = await API.graphql(graphqlOperation(listBooks))
      const books = bookData.data.listBooks.items
      setBooks(books)
    } catch (err) { console.log('error fetching books') }
  }

  async function deleteFunction(id){
    await API.graphql(graphqlOperation(deleteBook, {input: {id}}))
    fetchBooks()
  }
  
  return (
    <View>
      <View>
      <Text style={styles.title}>My Favorites</Text>
      <Button title="Refreash List" onPress={()=>fetchBooks()}/>
      </View>  
      <FlatList
          style={styles.list}
          data={books}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Card style={styles.card}>
               <View style={styles.picAnd}>
              { item.image ? <Image style={styles.pic} source={{uri: item.image}}/> : null}
                <Text style={styles.bookName}>{item.name}{'\n'}{item.description}</Text>
              </View>
                {item.link ? <TouchableOpacity style={styles.more} onPress={()=>{Linking.openURL(item.link)}}>
                <Text style={styles.more}>Cick here to buy the book! </Text>
              </TouchableOpacity> : null}
                <Button title="Delete Book" onPress={()=>deleteFunction(item.id)}/>
            </Card>
          )}
      />
    </View>

  )
}

const styles = StyleSheet.create({
  container: { },
  bookName: { fontSize: 25, marginRight: 60},
  title: {textAlign: 'center', fontSize: 40, backgroundColor: '#e7ad99', padding: 10},
  picAnd: {
    backgroundColor: '#ce796b',
    flexDirection: "row",
  },
  more: {
    fontSize: 13,
    fontStyle: "italic",
  },
  pic: {
    width: 60,
    height: 100,
    margin: 1
  },
  
  card: {
    justifyContent: 'center', 
    backgroundColor: '#e7ad99',
    marginTop: 10,
    padding: 2
  },
  list: {
    marginBottom: 110,
    marginLeft: 15,
  },
})

export default Favorite;