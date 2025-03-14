import { Tabs } from "expo-router";
import { View, Text, StyleSheet } from 'react-native';

import { FontAwesome } from "@expo/vector-icons";
import AntDesign from '@expo/vector-icons/AntDesign';
import ProtectedRoute from "../../components/ProtectRoute";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import Fontisto from '@expo/vector-icons/Fontisto';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Entypo from '@expo/vector-icons/Entypo';

export default function RootLayout() {
  return (
    <ProtectedRoute>
      <Tabs screenOptions={{
        headerShown: "Your App Name",  // This will hide the "(tabs)" header for all screens
      }}>
        <Tabs.Screen
          name="index"
          options={{
            headerShown: false,
            title: "",
            tabBarIcon: ({ color }) => (
              <AntDesign name="QQ" size={24} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="Games"
          options={{
            headerShown: false,
            title: "",
            tabBarIcon: ({ color }) => (
              <Ionicons name="game-controller" size={24} color={color} />
            ),
          }}
        />


        <Tabs.Screen
          name="BinauralBeats"
          options={{
            headerShown: false,
            title: "",
            tabBarIcon: ({ color }) => (
              <Fontisto name="heartbeat-alt" size={24} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="Diet"
          options={{
            title: "",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <FontAwesome6 name="bowl-food" size={24} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="acupoint"
          options={{
            headerShown: false,
            title: "",
            tabBarIcon: ({ color }) => (
              <FontAwesome6 name="feather-pointed" size={24} color={color} />
            ),
          }}
        />



        <Tabs.Screen
          name="Profile"
          options={{
            title: "",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="user" color={color} />
            ),
          }}
        />
      </Tabs>
    </ProtectedRoute>
  );
}


const styles = StyleSheet.create({
  tabs: {
    marginBottom: -20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#41B3A2",
    marginTop: 5
  },
  centeredContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabLabel: {
    fontSize: 14,
    color: "#333",
  },
});

