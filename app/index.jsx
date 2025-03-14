import * as React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { useRouter } from "expo-router";

const Home=()=>{
  const video = React.useRef(null);
  const router = useRouter();
  const [status, setStatus] = React.useState({});
  return (
    <View style={styles.container}>
      <Video
        ref={video}
        style={styles.video}
        source={{
          uri: "https://videos.pexels.com/video-files/5377700/5377700-sd_540_960_25fps.mp4",
        }}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        onPlaybackStatusUpdate={(status) => setStatus(() => status)}
      />
      <View style={styles.overlay}>
        <Text style={styles.mainText}>MindCare</Text>
        <Text style={styles.subText}>Don't stress seek help</Text>
        <Text style={styles.tagline}>Build Apps, Build Futures</Text>
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/auth/login")}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/auth/register")}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#121212", // Adds a subtle background for contrast
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Slightly darker overlay
  },
  mainText: {
    color: "#fff",
    fontSize: 68,
    fontWeight: "900", // Bolder for emphasis
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.3)", // Adds a subtle shadow for depth
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subText: {
    color: "#f0f0f0", // Slightly softer white
    fontSize: 24,
    fontWeight: "600", // Medium boldness for balance
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  tagline: {
    color: "#d3d3d3", // Lighter gray for a softer effect
    fontSize: 18,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 10,
    textShadowColor: "rgba(0, 0, 0, 0.1)", 
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    position: "absolute",
    bottom: 40, // Slightly higher to give better spacing
    left: 20, // Add padding for a balanced view
    right: 20, // Add padding for a balanced view
  },
  button: {
    backgroundColor: "#6200ea",
    paddingVertical: 14, // Larger padding for better touch experience
    paddingHorizontal: 24,
    borderRadius: 30, // More rounded for a modern look
    elevation: 5, // Stronger shadow effect
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase", // Makes the button text more prominent
    letterSpacing: 1.2, // Slight letter spacing for readability
  },
});
