import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Platform,
  StatusBar as NativeStatusBar,
  Button,
  FlatList,
  Pressable,
  ActivityIndicator
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import Octicons from '@expo/vector-icons/Octicons';
import { removeNo } from '@/lib/header-text';

export default function ChatScreen() {
  const isAndroid = useMemo(() => Platform.OS === "android", []);
  const [chat, setChat] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(0);
  const [inputText, setInputText] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const [attachmentMenuVisible, setAttachmentMenuVisible] = useState(false);

  const toggleMenu = () => setMenuVisible(!menuVisible);
  const toggleAttachmentMenu = () => setAttachmentMenuVisible(!attachmentMenuVisible);

  const fetchChatData = async (page: number) => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await fetch(`https://qa.corider.in/assignment/chat?page=${page}`);
      const data: ChatData = await response.json();
      console.log(page)
      const chats = data.chats.reverse();
      setChat((prevChat) => [...prevChat, ...chats]); 
      setPage((prevPage) => prevPage + 1); 
    } catch (error) {
      console.warn("Error fetching chats:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if(page === 0) fetchChatData(page);
  }, []);


  const renderItem = ({ item }: { item: Chat }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender.self ? styles.myMessage : styles.otherMessage,
      ]}
    >
      {!item.sender.self && <Image source={{ uri: item.sender.image }} style={styles.avatar} />}
      <View
        style={[
          styles.messageBubble,
          item.sender.self ? styles.myBubble : styles.otherBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            item.sender.self ? styles.myMessageText : styles.otherMessageText,
          ]}
        >
          {item.message}
        </Text>
      </View>
    </View>
  )
  
  
  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          paddingTop: isAndroid ? NativeStatusBar.currentHeight : 0,
        },
      ]}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ride 93</Text>
        </View>
        <TouchableOpacity>
          <Feather name="edit" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.tripDetails}>
        <View style={styles.tripInfo}>
          <Image
            source={require("@/assets/images/Profile.png")}
            style={styles.tripAvatar}
          />
          <View style={styles.tripText}>
            <Text style={styles.tripLabel}>From <Text style={styles.tripDestination}>IGI Airport, T3</Text></Text>
            <Text style={styles.tripLabel}>To <Text style={styles.tripDestination}>Sector 28</Text></Text>
          </View>
          <TouchableOpacity onPress={toggleMenu}>
            <MaterialIcons name="more-vert" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {menuVisible && (
          <View style={styles.menu}>
            <TouchableOpacity style={styles.menuItem}>
              <Octicons name="people" size={24} color="black" />
              <Text style={styles.menuText}>Members</Text>
            </TouchableOpacity>
            <View style={{ width: '100%', height: 0.5, backgroundColor: '#E5E5E0' }}></View>
            <TouchableOpacity style={styles.menuItem}>
              <Feather name="phone" size={22} color="black" />
              <Text style={styles.menuText}>Share Number</Text>
            </TouchableOpacity>
            <View style={{ width: '100%', height: 0.5, backgroundColor: '#E5E5E0' }}></View>
            <TouchableOpacity style={styles.menuItem}>
              <Octicons name="report" size={22} color="black" />
              <Text style={styles.menuText}>Report</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
        <View style={{flex : 1}}>
        <FlatList
       data={chat}
      renderItem={renderItem}
      keyExtractor={(item, index) => `${item.id}-${index}`} 
      contentContainerStyle={[styles.chatContainer]}  
     onEndReached={() => !loading && fetchChatData(page)}
     onEndReachedThreshold={1}
     nestedScrollEnabled={true}
    ListFooterComponent={
    loading ? (
      <ActivityIndicator size="small" color="#000" style={{ marginVertical: 10 }} />
    ) : null
  }
  inverted={true}
/>
        </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Reply to @Rohit Yadav"
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity
          onPress={toggleAttachmentMenu}
          style={{
            position: 'relative',
          }}
        >
          <MaterialIcons name="attach-file" size={24} color="black" style={styles.attachIcon} />
          {attachmentMenuVisible && (
            <View style={styles.attachmentMenu}>
              <TouchableOpacity style={styles.actionButton}>
                <Feather name="camera" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="videocam-outline" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <MaterialCommunityIcons name="clipboard-text-play" size={24} color="white" />
              </TouchableOpacity>

              <View
                style={{
                  position: 'absolute',
                  bottom: -10,
                  right: 10,
                  transform: [{
                    rotate: '180deg',
                  },
                  {
                    translateX: 42,
                  },
                  {
                    translateY: 2,
                  }],
                  width: 0,
                  height: 0,
                  borderLeftWidth: 10,
                  borderRightWidth: 10,
                  borderBottomWidth: 10,
                  borderLeftColor: 'transparent',
                  borderRightColor: 'transparent',
                  borderBottomColor: '#008000',
                }}
              >
              </View>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity>
          <Feather name="send" size={24} color="black" style={styles.sendIcon} />
        </TouchableOpacity>
      </View>


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadButton: {
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#1C63D5',
    margin: 16,
    borderRadius: 8,
  },
  loadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  tripDetails: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tripInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tripAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  tripText: {
    flex: 1,
  },
  tripLabel: {
    fontSize: 16,
    color: '#666',
  },
  tripDestination: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
  menu: {
    position: 'absolute',
    top: 50,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  menuText: {
    fontSize: 16,
  },
  dateDivider: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  chatContainer: {
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingBottom: 6,
    alignItems: 'flex-start',
  },
  myMessage: {
    justifyContent: 'flex-end',
  },
  otherMessage: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
  },
  myBubble: {
    backgroundColor: '#1C63D5',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#f0f0f0',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  myMessageText: {
    color: '#fff',
  },
  otherMessageText: {
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  attachIcon: {
    transform: [{ rotate: '135deg' }],
  },
  sendIcon: {
    transform: [{ rotate: '45deg' }]
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 10,
    fontSize: 16,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachmentMenu: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    top: -80,
    right: 0,
    transform: [{ translateX: 45 }],
    backgroundColor: '#008000',
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 4,
    width: 130,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1000,
  },
});

