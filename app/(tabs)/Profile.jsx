import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Modal, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { logoutAction } from "../(redux)/authSlice";
import ProtectedRoute from "../../components/ProtectRoute";
import { AntDesign } from '@expo/vector-icons';

export default function Profile() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [currentRating, setCurrentRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  
  // This would typically come from Redux state
  const [appRating, setAppRating] = useState({
    userRating: 0,
    userFeedback: "",
    submitted: false
  });

  const handleLogout = () => {
    dispatch(logoutAction());
    router.push("/auth/login");
  };

  const handleRatingPress = (rating) => {
    setCurrentRating(rating);
  };

  const handleSubmitRating = () => {
    // In a real app, you would dispatch an action to save to backend
    setAppRating({
      userRating: currentRating,
      userFeedback: feedback,
      submitted: true
    });
    setShowRatingModal(false);
    
    // Example dispatch (uncomment and modify for your redux setup)
    // dispatch(submitRating({ rating: currentRating, feedback }));
  };

  const renderStars = (rating, interactive = false) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity 
            key={star} 
            onPress={() => interactive && handleRatingPress(star)}
            disabled={!interactive}
          >
            <AntDesign 
              name={star <= (interactive ? currentRating : rating) ? "star" : "staro"} 
              size={interactive ? 40 : 24} 
              color="#FFD700" 
              style={styles.starIcon}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <ProtectedRoute>
      <View style={styles.container}>
        <Text style={styles.title}>User Profile</Text>
        {user ? (
          <ScrollView contentContainerStyle={styles.contentContainer}>
            <Text style={styles.text}>Email: {user.email}</Text>
            
            {/* App Rating Section */}
            <View style={styles.ratingSection}>
              <Text style={styles.sectionTitle}>App Rating</Text>
              
              {appRating.submitted ? (
                <View style={styles.submittedRating}>
                  <Text style={styles.ratingText}>Your rating:</Text>
                  {renderStars(appRating.userRating)}
                  <TouchableOpacity 
                    style={styles.editButton}
                    onPress={() => {
                      setCurrentRating(appRating.userRating);
                      setFeedback(appRating.userFeedback);
                      setShowRatingModal(true);
                    }}
                  >
                    <Text style={styles.editButtonText}>Edit Rating</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity 
                  style={styles.rateButton}
                  onPress={() => setShowRatingModal(true)}
                >
                  <Text style={styles.rateButtonText}>Rate This App</Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity style={styles.button} onPress={handleLogout}>
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </ScrollView>
        ) : (
          <Text style={styles.text}>No user logged in</Text>
        )}

        {/* Rating Modal */}
        <Modal
          visible={showRatingModal}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Rate Your Experience</Text>
              
              {renderStars(currentRating, true)}
              
              <TextInput
                style={styles.feedbackInput}
                placeholder="Tell us what you think (optional)"
                multiline={true}
                numberOfLines={4}
                value={feedback}
                onChangeText={setFeedback}
              />
              
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowRatingModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.modalButton, styles.submitButton]}
                  onPress={handleSubmitRating}
                  disabled={currentRating === 0}
                >
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ProtectedRoute>
  );
}

// Add TextInput to imports
import { TextInput } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  contentContainer: {
    padding: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 24,
    textAlign: "center",
  },
  text: {
    fontSize: 18,
    marginBottom: 16,
  },
  button: {
    height: 50,
    backgroundColor: "#6200ea",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 20,
    marginTop: 24,
    width: "80%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    marginTop: 24,
  },
  ratingSection: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  starsContainer: {
    flexDirection: "row",
    marginVertical: 12,
  },
  starIcon: {
    marginHorizontal: 5,
  },
  rateButton: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginTop: 8,
  },
  rateButtonText: {
    fontSize: 16,
    color: "#555",
  },
  submittedRating: {
    alignItems: "center",
    width: "100%",
  },
  ratingText: {
    fontSize: 16,
    marginBottom: 4,
  },
  editButton: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  editButtonText: {
    color: "#6200ea",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  feedbackInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    marginBottom: 24,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: "45%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cancelButtonText: {
    color: "#555",
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#6200ea",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  }
});