import React, { useState, useEffect, useRef } from "react";
import * as GoogleGenerativeAI from "@google/generative-ai";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import * as Speech from "expo-speech";
import { FontAwesome } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import FlashMessage, { showMessage } from "react-native-flash-message";

const GeminiChat = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false); // Speech is OFF by default
  const [showStopIcon, setShowStopIcon] = useState(false);
  
  // Reference to the FlatList component for scrolling
  const flatListRef = useRef(null);

  const API_KEY = "AIzaSyDzcy_-VZ06a_AWCr2QcM5n630mwN8PSvA";
  // Use a consistent model name throughout the component
  const MODEL_NAME = "gemini-1.5-pro"; 

  useEffect(() => {
    const startChat = async () => {
      try {
        const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });
        const prompt = "say \"Hello there, How do you feel\" ";
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        console.log(text);
        showMessage({
          message: "Welcome to MindCare Innovations🤖",
          description: text,
          type: "info",
          icon: "info",
          duration: 2000,
        });
        setMessages([
          {
            text,
            user: false,
          },
        ]);
      } catch (error) {
        console.error("Error starting chat:", error);
        showMessage({
          message: "Error",
          description: "Could not connect to AI service. Please try again later.",
          type: "danger",
        });
      }
    };
    
    startChat();
    
    // Clean up speech on unmount
    return () => {
      Speech.stop();
    };
  }, []);

  // Scroll to the end whenever messages are updated
  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 100); // Small delay to ensure the list has updated
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!userInput.trim()) return;
    
    setLoading(true);
    const userMessage = { text: userInput, user: true };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    
    try {
      const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
      // Use the same model name as in startChat
      const model = genAI.getGenerativeModel({ model: MODEL_NAME });
      const prompt = userMessage.text;
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      setMessages((prevMessages) => [...prevMessages, { text, user: false }]);
      
      // Only speak if speech is enabled
      if (speechEnabled) {
        try {
          await Speech.stop();
          await Speech.speak(text, {
            onStart: () => {
              setIsSpeaking(true);
              setShowStopIcon(true);
            },
            onDone: () => {
              setIsSpeaking(false);
            },
            onStopped: () => {
              setIsSpeaking(false);
            },
            onError: (error) => {
              console.error("Speech error:", error);
              setIsSpeaking(false);
            }
          });
        } catch (speechError) {
          console.error("Speech error:", speechError);
        }
      } else {
        // Just show the stop icon if we received a response
        setShowStopIcon(true);
      }
      
    } catch (error) {
      console.error("Error sending message:", error);
      showMessage({
        message: "Error",
        description: "Failed to get a response. Please try again.",
        type: "danger",
      });
    } finally {
      setLoading(false);
      setUserInput("");
    }
  };

  const toggleSpeech = async () => {
    // Toggle speech enabled state
    const newSpeechEnabled = !speechEnabled;
    setSpeechEnabled(newSpeechEnabled);
    
    // If speaking, stop it
    if (isSpeaking) {
      await Speech.stop();
      setIsSpeaking(false);
    }
    
    // If enabling speech and we have messages, speak the last one
    if (newSpeechEnabled && messages.length > 0) {
      const lastBotMessage = [...messages].filter(msg => !msg.user).pop();
      if (lastBotMessage) {
        try {
          await Speech.speak(lastBotMessage.text, {
            onStart: () => {
              setIsSpeaking(true);
            },
            onDone: () => {
              setIsSpeaking(false);
            },
            onStopped: () => {
              setIsSpeaking(false);
            }
          });
        } catch (error) {
          console.error("Error speaking message:", error);
        }
      }
    }
    
    // Show status message
    showMessage({
      message: newSpeechEnabled ? "Speech enabled" : "Speech disabled",
      type: "info",
      duration: 1500,
    });
  };

  const clearMessages = async () => {
    try {
      await Speech.stop();
      setIsSpeaking(false);
      setMessages([]);
      setShowStopIcon(false);
    } catch (error) {
      console.error("Error clearing messages:", error);
    }
  };

  const renderMessage = ({ item }) => (
    <View style={styles.messageContainer}>
      <Text style={[styles.messageText, item.user && styles.userMessage]}>
        {item.text}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Speech Toggle Button at the top */}
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={[styles.speechToggleButton, speechEnabled && styles.speechToggleButtonActive]} 
          onPress={toggleSpeech}
        >
          <Text style={styles.speechToggleText}>
            {speechEnabled ? "Speech: ON" : "Speech: OFF"}
          </Text>
          <FontAwesome
            name={speechEnabled ? "volume-up" : "volume-off"}
            size={18}
            color="white"
            style={styles.speechToggleIcon}
          />
        </TouchableOpacity>
        {showStopIcon && (
          <TouchableOpacity style={styles.clearButton} onPress={clearMessages}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
      />
      
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Type a message"
          onChangeText={setUserInput}
          value={userInput}
          style={styles.input}
          placeholderTextColor="#999"
          multiline={true}
          numberOfLines={1}
        />
        
        {loading ? (
          <View style={styles.sendButton}>
            <ActivityIndicator size="small" color="white" />
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.sendButton}
            onPress={sendMessage}
            disabled={!userInput.trim()}
          >
            <Ionicons name="send" size={24} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#ffff", 
    marginTop: 50 
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0"
  },
  speechToggleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#808080",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  speechToggleButtonActive: {
    backgroundColor: "#4285F4",
  },
  speechToggleText: {
    color: "white",
    marginRight: 6,
    fontWeight: "500",
  },
  speechToggleIcon: {
    marginLeft: 4,
  },
  clearButton: {
    backgroundColor: "#ee6e73",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  clearButtonText: {
    color: "white",
    fontWeight: "500",
  },
  messageList: { 
    flexGrow: 1,
    padding: 10,
  },
  messageContainer: { 
    padding: 10, 
    marginVertical: 5 
  },
  messageText: { 
    fontSize: 16,
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 18,
    maxWidth: "80%",
    alignSelf: "flex-start"
  },
  userMessage: {
    backgroundColor: "#dcf8c6",
    alignSelf: "flex-end"
  },
  inputContainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  input: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
    minHeight: 50,
    maxHeight: 100,
    color: "#333",
  },
  sendButton: {
    backgroundColor: "#131314",
    borderRadius: 25,
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
});

export default GeminiChat;