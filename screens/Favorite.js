import React from 'react';

import { useEffect, useState } from 'react'
import {
  View, Text, StyleSheet, Button, FlatList
} from 'react-native'
import { API, graphqlOperation } from 'aws-amplify'
import { deleteBook } from '../graphql/mutations'
import { listBooks } from '../graphql/queries'

const initialState = { name: '', description: '' }

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
      </View>  

      <FlatList 
          data={books}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.container}>
              <Text style={styles.bookName}>{item.name}</Text>
              <View style={styles.picAnd}>
              <Text style={styles.bookDescription}>{item.description}</Text>
              <Button title="Delete Book" onPress={()=>deleteFunction(item.id)}/>
              </View>
            </View>
          )}
      />
    </View>

  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 2},
  bookName: { fontSize: 20, backgroundColor: '#ce796b'},
  bookDescription: {fontSize: 20, backgroundColor: '#e7ad99'},
  title: {textAlign: 'center', fontSize: 40, backgroundColor: '#e7ad99', marginTop: 50, padding: 10},
  picAnd: {
    //flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: '#e7ad99',
  }
})

export default Favorite;