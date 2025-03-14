import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, StatusBar, Alert } from 'react-native';
import { Linking } from 'react-native';
import { Audio } from 'expo-av';

function App() {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState('focus');
  const [showFeedback, setShowFeedback] = useState(false);
  const [mood, setMood] = useState(5);
  const [progressLog, setProgressLog] = useState([]);
  const [isPomodoroActive, setIsPomodoroActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1500);
  const [focusLevel, setFocusLevel] = useState(5);

  const frequencies = {
    adhd: { base: 40, beat: 10, color: '#9C27B0' },
    focus: { base: 20, beat: 15, color: '#2196F3' },
    relax: { base: 10, beat: 7, color: '#4CAF50' },
    meditation: { base: 6, beat: 3, color: '#FF9800' },
    sleep: { base: 3, beat: 1, color: '#3F51B5' },
  };

  // Request permissions when the component mounts
  useEffect(() => {
    async function requestPermissions() {
      try {
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert("Permission Error", "Audio permissions not granted");
          return;
        }
        
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
        console.log("Audio permissions granted and audio mode set");
      } catch (err) {
        console.error('Failed to get audio permissions', err);
        Alert.alert("Permission Error", "Failed to get audio permissions. Some features may not work.");
      }
    }
    
    requestPermissions();
    
    return () => {
      if (sound) {
        console.log("Unloading sound in cleanup");
        sound.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    let timer;
    if (isPomodoroActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      Alert.alert("Pomodoro Complete", "Your 25-minute session is complete! Time for a break.");
      setIsPomodoroActive(false);
      setTimeLeft(1500);
    }
    return () => clearInterval(timer);
  }, [isPomodoroActive, timeLeft]);

  // This is the key function that needs fixing
  const startBinauralBeats = async () => {
    try {
      console.log("Starting binaural beats for:", selectedFrequency);
      
      // First, unload any existing sound
      if (sound) {
        console.log("Unloading previous sound");
        await sound.unloadAsync();
      }
      
      // Define the audio assets with the correct path
      const audioAssets = {
        adhd: require('../../assets/audio/adhd.mp3'),
        focus: require('../../assets/audio/focus.mp3'),
        relax: require('../../assets/audio/relax.mp3'),
        meditation: require('../../assets/audio/meditation.mp3'),
        sleep: require('../../assets/audio/sleep.mp3'),
      };
      
      console.log("Loading audio asset for:", selectedFrequency);
      
      // Load and play the sound
      const { sound: newSound } = await Audio.Sound.createAsync(
        audioAssets[selectedFrequency],
        { shouldPlay: true, isLooping: true, volume: 1.0 },
        onPlaybackStatusUpdate
      );
      
      console.log("Audio loaded successfully");
      setSound(newSound);
      setIsPlaying(true);
      setShowFeedback(false);
      
    } catch (error) {
      console.error("Failed to play sound", error);
      Alert.alert(
        "Audio Error", 
        `Error playing ${selectedFrequency} audio: ${error.message}`
      );
    }
  };

  // Add a status update callback to monitor playback
  const onPlaybackStatusUpdate = (status) => {
    console.log("Playback status:", status);
    if (status.isLoaded) {
      if (status.isPlaying) {
        console.log("Audio is playing");
      } else {
        console.log("Audio is paused or stopped");
      }
      
      if (status.didJustFinish) {
        console.log("Audio playback finished");
      }
    } else {
      // The sound is not loaded
      if (status.error) {
        console.error(`Error: ${status.error}`);
      }
    }
  };

  const stopBinauralBeats = async () => {
    console.log("Attempting to stop binaural beats");
    if (sound) {
      try {
        console.log("Stopping sound playback");
        await sound.stopAsync();
        console.log("Unloading sound");
        await sound.unloadAsync();
        setSound(null);
        setIsPlaying(false);
        setShowFeedback(true);
        console.log("Sound stopped and unloaded successfully");
      } catch (error) {
        console.error("Failed to stop sound", error);
        Alert.alert("Error", "Failed to stop playback: " + error.message);
      }
    } else {
      console.log("No sound object to stop");
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const stopPomodoro = () => {
    setIsPomodoroActive(false);
  };

  const startPomodoro = () => {
    setIsPomodoroActive(true);
  };

  const handleProgressSubmit = () => {
    const newLog = {
      mood: mood,
      frequency: selectedFrequency,
      date: new Date().toLocaleDateString(),
    };
    setProgressLog([...progressLog, newLog]);
    setMood(5);
    Alert.alert("Success", "Progress logged!");
    setShowFeedback(false);
  };

  const handleFocusLevelSubmit = () => {
    const newLog = {
      focus: focusLevel,
      frequency: selectedFrequency,
      date: new Date().toLocaleDateString(),
    };
    setProgressLog((prev) => [...prev, newLog]);
    Alert.alert("Success", "Focus level logged!");
    setFocusLevel(5);
  };

  const openURL = (url) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.error("Cannot open URL:", url);
        Alert.alert("Cannot Open Link", "Unable to open the link: " + url);
      }
    }).catch(err => {
      console.error("Error opening URL:", err);
      Alert.alert("Cannot Open Link", "Error opening the link: " + url);
    });
  };

  // Get current frequency data for styling
  const currentFreq = frequencies[selectedFrequency];

  return (
    <ScrollView style={styles.scrollView}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <Text style={styles.title}>Binaural Beats for Mental Health</Text>
        
        <View style={styles.frequencySelector}>
          <Text style={styles.label}>Select Frequency for Purpose:</Text>
          <View style={styles.pickerContainer}>
            {Object.keys(frequencies).map((freq) => (
              <TouchableOpacity
                key={freq}
                style={[
                  styles.frequencyOption,
                  { backgroundColor: frequencies[freq].color },
                  selectedFrequency === freq && styles.selectedFrequency
                ]}
                onPress={() => setSelectedFrequency(freq)}
              >
                <Text style={styles.frequencyText}>
                  {freq.charAt(0).toUpperCase() + freq.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text style={styles.frequencyInfo}>
          Current: {selectedFrequency.toUpperCase()} - Base: {currentFreq.base}Hz, Beat: {currentFreq.beat}Hz
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              styles.startButton,
              isPlaying && styles.disabledButton
            ]}
            onPress={startBinauralBeats}
            disabled={isPlaying}
          >
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.button,
              styles.stopButton,
              !isPlaying && styles.disabledButton
            ]}
            onPress={stopBinauralBeats}
            disabled={!isPlaying}
          >
            <Text style={styles.buttonText}>Stop</Text>
          </TouchableOpacity>
        </View>

        {isPlaying && (
          <View style={styles.playingIndicator}>
            <Text style={styles.playingText}>
              ♫ Now playing {selectedFrequency} frequency ♫
            </Text>
          </View>
        )}

        {/* Rest of your UI components remain the same */}
        {/* Pomodoro Timer, Feedback Form, Focus Level Tracking, Progress Display, etc. */}
        
        <TouchableOpacity 
          style={styles.linkContainer}
          onPress={() => openURL('https://superkalammusic.vercel.app/')}
        >
          <Text style={styles.linkText}>Click Here for more music options...</Text>
        </TouchableOpacity>

        {/* Footer area */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Use headphones for best experience
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  container: {
    flex: 1,
    padding: 20,
    minHeight: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 15,
    marginTop: 10,
  },
  frequencySelector: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    color: '#e0e0e0',
    marginBottom: 10,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
  },
  frequencyOption: {
    padding: 12,
    margin: 5,
    borderRadius: 25,
    minWidth: 100,
    alignItems: 'center',
  },
  selectedFrequency: {
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  frequencyText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  frequencyInfo: {
    color: '#bdbdbd',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    minWidth: 150,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  stopButton: {
    backgroundColor: '#f44336',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  playingIndicator: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  playingText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  linkContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 15,
    borderRadius: 8,
    marginVertical: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#81d4fa',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  pomodoroContainer: {
    marginVertical: 20,
    padding: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 10,
  },
  pomodoroButtonContainer: {
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  timerDisplay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 28,
    color: '#ffffff',
    fontFamily: 'monospace',
  },
  pomodoroButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  feedbackContainer: {
    marginVertical: 20,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
  },
  focusContainer: {
    marginVertical: 20,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
  },
  formGroup: {
    marginBottom: 15,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 10,
    borderRadius: 5,
  },
  sliderValue: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  sliderControls: {
    flexDirection: 'row',
  },
  sliderButton: {
    width: 36,
    height: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  sliderButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  progressContainer: {
    marginVertical: 20,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
  },
  logItem: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  logDate: {
    color: '#bbbbbb',
    fontSize: 14,
    marginBottom: 5,
  },
  logText: {
    color: '#ffffff',
    fontSize: 16,
  },
  moreLogsText: {
    color: '#bbbbbb',
    textAlign: 'center',
    marginTop: 5,
    fontStyle: 'italic',
  },
  footer: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  footerText: {
    color: '#aaaaaa',
    fontSize: 14,
    fontStyle: 'italic',
  },
});

export default App;

