import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  StatusBar, 
  SafeAreaView,
  Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Using local images from assets
const acuPointsData = [
  {
    title: 'LI4 (Hegu)',
    image: require('../../assets/images/1.png'),
    benefits: 'Relieves headaches, stress, and facial pain. Promotes overall well-being.',
    location: 'Between thumb and index finger'
  },
  {
    title: 'ST36 (Zusanli)',
    image: require('../../assets/images/2.jpg'),
    benefits: 'Boosts energy, strengthens the immune system, and aids digestion.',
    location: 'Below the knee, outside the shinbone'
  },
  {
    title: 'SP6 (Sanyinjiao)',
    image: require('../../assets/images/3.jpg'),
    benefits: 'Helps with digestion, menstrual pain, and anxiety. Supports kidney, liver, and spleen health.',
    location: '3 inches above the inner ankle bone'
  },
  {
    title: 'LV3 (Taichong)',
    image: require('../../assets/images/4.jpg'),
    benefits: 'Relieves stress, irritability, and headaches; balances emotions.',
    location: 'Between the first and second toe, in the depression'
  },
  {
    title: 'PC6 (Neiguan)',
    image: require('../../assets/images/5.jpg'),
    benefits: 'Eases nausea, motion sickness, anxiety, and carpal tunnel syndrome.',
    location: 'Inner forearm, 2 inches above the wrist crease'
  },
  {
    title: 'GB20 (Fengchi)',
    image: require('../../assets/images/6.jpg'),
    benefits: 'Relieves headaches, dizziness, neck pain, and colds.',
    location: 'Base of the skull, in the hollows on both sides'
  },
  {
    title: 'CV17 (Shanzhong)',
    image: require('../../assets/images/7.jpg'),
    benefits: 'Opens the chest, promotes emotional balance, reduces anxiety.',
    location: 'Center of the breastbone, between the nipples'
  },
  {
    title: 'BL60 (Kunlun)',
    image: require('../../assets/images/8.jpg'),
    benefits: 'Alleviates back pain, headaches, and stress.',
    location: 'Between the outer ankle bone and Achilles tendon'
  },
  {
    title: 'KD1 (Yongquan)',
    image: require('../../assets/images/9.jpg'),
    benefits: 'Grounds energy, relieves dizziness, promotes calmness.',
    location: 'Center of the sole of the foot, in the depression'
  },
  {
    title: 'HT7 (Shenmen)',
    image: require('../../assets/images/10.jpg'),
    benefits: 'Calms the mind, reduces anxiety, helps with insomnia.',
    location: 'At the wrist crease, on the little finger side'
  },
  {
    title: 'BL23 (Shenshu)',
    image: require('../../assets/images/11.jpg'),
    benefits: 'Strengthens kidney energy, relieves lower back pain and fatigue.',
    location: 'On the lower back, level with the second lumbar vertebra'
  },
  {
    title: 'SI3 (Houxi)',
    image: require('../../assets/images/12.jpg'),
    benefits: 'Relieves headaches, neck pain, and shoulder tension.',
    location: 'On the outer hand, when making a fist, in the depression'
  },
];

const HEADER_MAX_HEIGHT = 120; // Header max height
const HEADER_MIN_HEIGHT = 60;  // Header min height when scrolled
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const App = () => {
  const [selectedPoint, setSelectedPoint] = useState(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  // Calculate header height and opacity based on scroll position
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE * 0.5, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.3, 0],
    extrapolate: 'clamp',
  });

  const compactTitleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE * 0.8, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });

  const subtitleTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -20],
    extrapolate: 'clamp',
  });

  const renderImage = (source) => {
    // Handle both require() for local images and URLs for remote images
    if (typeof source === 'string') {
      return (
        <View style={styles.imageContainer}>
          <Image source={{ uri: source }} style={styles.image} resizeMode="cover" />
        </View>
      );
    } else {
      return (
        <View style={styles.imageContainer}>
          <Image source={source} style={styles.image} resizeMode="cover" />
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <LinearGradient 
        colors={['#4B0082', '#8A2BE2']} 
        start={{ x: 0, y: 0 }} 
        end={{ x: 1, y: 0.8 }} 
        style={styles.container}
      >
        {/* Animated Header */}
        <Animated.View style={[styles.header, { height: headerHeight }]}>
          <Animated.View style={[styles.titleContainer, { opacity: headerTitleOpacity }]}>
            <Text style={styles.title}>Acupressure Points</Text>
            <Animated.Text 
              style={[
                styles.subtitle, 
                { transform: [{ translateY: subtitleTranslateY }] }
              ]}
            >
              Traditional remedies for modern wellness
            </Animated.Text>
          </Animated.View>
          
          {/* Compact header title that appears when scrolled */}
          <Animated.View 
            style={[
              styles.compactTitleContainer, 
              { opacity: compactTitleOpacity }
            ]}
          >
            <Text style={styles.compactTitle}>Acupressure Points</Text>
          </Animated.View>
        </Animated.View>
        
        <Animated.ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
        >
          {acuPointsData.map((point, index) => (
            <View key={index} style={styles.cardWrapper}>
              <TouchableOpacity
                style={[
                  styles.card,
                  selectedPoint === point.title && styles.selectedCard
                ]}
                activeOpacity={0.7}
                onPress={() => 
                  setSelectedPoint(selectedPoint === point.title ? null : point.title)
                }
              >
                <View style={styles.cardContent}>
                  <Text style={styles.pointTitle}>{point.title}</Text>
                  <View style={styles.expandIconContainer}>
                    <Text style={styles.expandIcon}>
                      {selectedPoint === point.title ? '−' : '+'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              {selectedPoint === point.title && (
                <View style={styles.detailsContainer}>
                  {renderImage(point.image)}
                  
                  <View style={styles.infoSection}>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Location:</Text>
                      <Text style={styles.infoText}>{point.location}</Text>
                    </View>
                    
                    <View style={styles.divider} />
                    
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Benefits:</Text>
                      <Text style={styles.infoText}>{point.benefits}</Text>
                    </View>
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => setSelectedPoint(null)}
                  >
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Consult with a qualified practitioner before applying pressure
            </Text>
          </View>
        </Animated.ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#4B0082',
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    justifyContent: 'center',
    overflow: 'hidden',
    zIndex: 10,
  },
  titleContainer: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  compactTitleContainer: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  compactTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 10,
  },
  cardWrapper: {
    marginBottom: 12,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  selectedCard: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4B0082',
    flex: 1,
  },
  expandIconContainer: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(75, 0, 130, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandIcon: {
    fontSize: 22,
    lineHeight: 24,
    color: '#4B0082',
    fontWeight: 'bold',
  },
  detailsContainer: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    marginTop: -1, // This ensures no gap between card and details
  },
  imageContainer: {
    width: '100%',
    height: 200,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoSection: {
    padding: 16,
  },
  infoRow: {
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#4B0082',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    marginVertical: 12,
  },
  closeButton: {
    padding: 12,
    backgroundColor: 'rgba(75, 0, 130, 0.1)',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  closeButtonText: {
    color: '#4B0082',
    fontWeight: '600',
    fontSize: 16,
  },
  footer: {
    marginTop: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
});

export default App;