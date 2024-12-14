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
  StatusBar as NativeStatusBar
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import Octicons from '@expo/vector-icons/Octicons';
import { removeNo } from '@/lib/header-text';

export default function ChatScreen() {
  const isAndroid = useMemo(() => Platform.OS === "android", []);
  const [chat, setChat] = useState<ChatData | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [inputText, setInputText] = useState('');
  const [attachmentMenuVisible, setAttachmentMenuVisible] = useState(false);

  const toggleMenu = () => setMenuVisible(!menuVisible);
  const toggleAttachmentMenu = () => setAttachmentMenuVisible(!attachmentMenuVisible);

  useEffect(()=>{
    const fetchAss = async() => {
      const response = await fetch("https://qa.corider.in/assignment/chat?page=0")
      const data : ChatData = await response.json();
      setChat(data);
    }
    fetchAss();
  },[])

/*   const renderAttachmentMenuItem = (icon : any, label : any) => (
    <TouchableOpacity style={styles.attachmentMenuItem}>
      <View style={styles.attachmentMenuItemIcon}>
        <MaterialIcons name={icon} size={24} color="#fff" />
      </View>
      <Text style={styles.attachmentMenuItemText}>{label}</Text>
    </TouchableOpacity>
  ); */

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
          <Text style={styles.headerTitle}>{removeNo(chat?.name)}</Text>
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
            <Text style={styles.tripLabel}>From <Text style={styles.tripDestination}>{chat?.from}</Text></Text>
            <Text style={styles.tripLabel}>To <Text style={styles.tripDestination}>{chat?.to}</Text></Text>
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
            <View style={{width:'100%' , height:0.5, backgroundColor: '#E5E5E0'}}></View>
            <TouchableOpacity style={styles.menuItem}>
            <Feather name="phone" size={22} color="black" />
              <Text style={styles.menuText}>Share Number</Text>
            </TouchableOpacity>
            <View style={{width:'100%' , height:0.5, backgroundColor: '#E5E5E0'}}></View>
            <TouchableOpacity style={styles.menuItem}>
            <Octicons name="report" size={22} color="black" />
              <Text style={styles.menuText}>Report</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView style={styles.chatContainer}>
        {chat?.chats.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageContainer,
              message.sender.self  ? styles.myMessage : styles.otherMessage
            ]}
          >
            {  !message.sender.self &&
              <Image source={{ uri: message.sender.image }} style={styles.avatar} />
            }
            <View
              style={[
                styles.messageBubble,
                message.sender.self ? styles.myBubble : styles.otherBubble
              ]}
            >
              <Text style={[
                styles.messageText,
                message.sender.self  ? styles.myMessageText : styles.otherMessageText
              ]}>
                {message.message}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Reply to @Rohit Yadav"
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity onPress={toggleAttachmentMenu}>
          <MaterialIcons name="attach-file" size={24} color="black" style={styles.attachIcon} />
        </TouchableOpacity>
        <TouchableOpacity>
        <Feather name="send" size={24} color="black" style={styles.sendIcon} />
        </TouchableOpacity>
      </View>

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
        </View>
      )}
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    fontSize : 16,
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
    zIndex : 1
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
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingBottom : 6,
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
    transform: [{rotate: '45deg'}]
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
    bottom: 65,
    right: 16,
    backgroundColor: '#008000',
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 4,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1000,
  },
  attachmentMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  attachmentMenuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a73e8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  attachmentMenuItemText: {
    fontSize: 16,
    color: '#000',
  },
});

