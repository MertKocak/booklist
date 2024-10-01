import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Modal, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [bookName, setBookName] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [books, setBooks] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const storedBooks = await AsyncStorage.getItem('books');
      if (storedBooks) {
        setBooks(JSON.parse(storedBooks));
      }
    } catch (error) {
      console.error('Failed to load books:', error);
    }
  };

  const saveBooks = async (newBooks) => {
    try {
      await AsyncStorage.setItem('books', JSON.stringify(newBooks));
    } catch (error) {
      console.error('Failed to save books:', error);
    }
  };

  const addBook = () => {
    if (bookName && authorName) {
      const newBooks = [...books, { id: Date.now().toString(), bookName, authorName, read: false }];
      setBooks(newBooks);
      setBookName('');
      setAuthorName('');
      setIsAdding(false);
      saveBooks(newBooks);
    }
  };

  const deleteBook = (id) => {
    const newBooks = books.filter(book => book.id !== id);
    setBooks(newBooks);
    saveBooks(newBooks);
  };

  const toggleReadStatus = (id) => {
    const newBooks = books.map(book =>
      book.id === id ? { ...book, read: !book.read } : book
    );
    setBooks(newBooks);
    saveBooks(newBooks);
  };

  const filteredBooks = books.filter(
    book => book.bookName.toLowerCase().includes(searchText.toLowerCase()) ||
      book.authorName.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Text style={styles.navbarTitle}>BookList</Text>
        <TouchableOpacity onPress={() => setIsAdding(true)}>
          <Image style={{ height: 20, width: 20, tintColor: "white" }} source={require("./assets/icons/add.png")} />
        </TouchableOpacity>
      </View>
      <TextInput
        placeholderTextColor={"gray"}
        placeholder="Ara..."
        value={searchText}
        onChangeText={setSearchText}
        style={styles.searchbar}
      />
      <FlatList
        data={filteredBooks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.bookItem}>
            <TouchableOpacity onPress={() => toggleReadStatus(item.id)}>
              <View style={[styles.checkbox, item.read && styles.checkboxChecked]} />
            </TouchableOpacity>
            <View>
              <Text style={[styles.bookTextBook, item.read && styles.bookTextRead]}>
                {item.bookName}
              </Text>
              <Text style={[styles.bookTextWriter, item.read && styles.bookTextRead]}>
                {item.authorName}
              </Text>
            </View>
             <View style = {{backgroundColor: "red", flex: 1}}>    
            </View> 
            <TouchableOpacity  onPress={() => deleteBook(item.id)}>
            <Image style={{ height: 18, width: 18, tintColor: "#004aad" }} source={require("./assets/icons/delete.png")} />
            </TouchableOpacity>
          </View>
        )}
      />

      <Modal
        visible={isAdding}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsAdding(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Yeni Kitap Ekle</Text>
            <TextInput
              placeholderTextColor={"gray"}
              placeholder="Kitap İsmi"
              value={bookName}
              onChangeText={setBookName}
              style={styles.input}
            />
            <TextInput
              placeholderTextColor={"gray"}
              placeholder="Yazar İsmi"
              value={authorName}
              onChangeText={setAuthorName}
              style={styles.input}
            />
            <View style={{ flexDirection: "row", justifyContent: 'space-between', width: 268, margin: 16, marginBottom: 0 }}>
              <TouchableOpacity
                style={{ backgroundColor: "#ED3B3B", padding: 10, borderRadius: 8, marginTop: 0, width: "36%" }} onPress={() => setIsAdding(false)}>
                <Text style={{ fontFamily: "Manrope-SemiBold",color: "#F5F7FA",  fontSize: 14, textAlign: 'center' }}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ backgroundColor: "#004aad", padding: 10, borderRadius: 8, marginTop: 0, width: "60%" }} onPress={addBook}>
                <Text style={{ fontFamily: "Manrope-SemiBold",color: "#F5F7FA", fontSize: 14, textAlign: 'center' }}>Kitap Ekle</Text>
              </TouchableOpacity>

            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "white"
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    height: 50,
    marginTop: -20,
    backgroundColor: '#004aad',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  navbarTitle: {
    fontSize: 20,
    marginLeft: 0,
    color: "#F5F7FA",
    fontFamily: "Manrope-Medium",
  },
  searchbar: {
    borderWidth: 0.7,
    borderColor: '#004aad',
    height: 40,
    paddingLeft: 16,
    margin: 16,
    marginTop: 12,
    marginBottom: 12,
    borderRadius: 8,
    color: "black",
    fontFamily: "Manrope-Regular",
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    marginTop: 0,
    marginLeft: 16,
    marginRight: 16,
    paddingTop: 4,
    padding: 8,
    paddingLeft: 12,
    paddingBottom: 6,
    backgroundColor: "#F4F9FF",
    borderRadius: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 0.6,
    borderColor: '#004aad',
    marginRight: 10,
    borderRadius: 16,
    backgroundColor: "white"
  },
  checkboxChecked: {
    borderRadius: 16,
    backgroundColor: '#004aad',
    borderWidth: 0.6,
    borderColor: '#004aad',
    width: 20,
    height: 20
  },
  bookTextBook: {
    fontFamily: "Manrope-Medium",
    fontSize: 14,
    marginLeft: 4,
    color: 'black',
  },
  bookTextWriter: {
    fontSize: 12,
    fontFamily: "Manrope-Regular",
    marginLeft: 4,
    color: 'gray',
  },
  bookTextRead: {
    color: 'gray',
    textDecorationLine: 'line-through',
    fontFamily: "Manrope-Regular",
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 14,
    marginBottom: 10,
    color: "#004aad",
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
  },
  input: {
    borderWidth: 0.5,
    borderColor: '#004aad',
    padding: 10,
    marginVertical: 5,
    width: '100%',
    borderRadius: 8,
    height: 40,
    color: "black",
    fontSize: 14,
    backgroundColor: "white",
    fontFamily: "Manrope-Regular",
  },
});

export default App;
