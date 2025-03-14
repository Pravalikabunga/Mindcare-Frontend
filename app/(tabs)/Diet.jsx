import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, StatusBar, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const symptomsData = [
  { title: 'Brain Fog' },
  { title: 'PTSD' },
  { title: 'ADHD' },
  { title: 'Anxiety' },
  { title: 'Depression' },
  { title: 'Stress' },
];

const foodRecommendations = {
  'Brain Fog': {
    take: [
      'Fatty fish (salmon)',
      'Blueberries',
      'Dark chocolate',
      'Nuts (almonds, walnuts)',
      'Leafy greens (spinach, kale)',
      'Avocado',
      'Turmeric',
      'Eggs',
      'Beets',
      'Pumpkin seeds',
    ],
    avoid: [
      'Processed sugars',
      'High-fat junk foods',
      'Excess caffeine',
      'White bread',
      'Artificial sweeteners',
    ],
  },
  'PTSD': {
    take: [
      'Omega-3 rich foods (salmon, flaxseeds)',
      'Lean proteins (chicken, turkey)',
      'Whole grains (brown rice, quinoa)',
      'Antioxidant-rich fruits (berries, oranges)',
      'Leafy greens (spinach, collard greens)',
      'Dark chocolate',
      'Nuts and seeds (chia seeds, walnuts)',
      'Yogurt',
      'Oats',
    ],
    avoid: [
      'Caffeine',
      'Alcohol',
      'Refined sugars',
      'Processed foods',
      'High-fat dairy products',
    ],
  },
  'ADHD': {
    take: [
      'Lean proteins (chicken, turkey, fish)',
      'Fruits and vegetables (especially berries and broccoli)',
      'Whole grains (brown rice, quinoa, oats)',
      'Legumes (beans, lentils)',
      'Healthy fats (avocado, olive oil)',
      'Eggs',
      'Dark chocolate',
    ],
    avoid: [
      'Sugary snacks (candy, soda)',
      'Fast food',
      'Caffeine',
      'Artificial food colorings',
      'Highly processed foods',
    ],
  },
  'Anxiety': {
    take: [
      'Omega-3 fatty acids (fatty fish, chia seeds)',
      'Whole grains (brown rice, oatmeal)',
      'Leafy greens (spinach, kale)',
      'Berries (blueberries, strawberries)',
      'Turmeric',
      'Dark chocolate',
      'Nuts (walnuts, almonds)',
      'Green tea',
      'Yogurt',
    ],
    avoid: [
      'Caffeine',
      'Sugar',
      'Alcohol',
      'High-sugar snacks',
      'Processed foods',
    ],
  },
  'Depression': {
    take: [
      'Fruits (bananas, oranges, apples)',
      'Vegetables (carrots, bell peppers, broccoli)',
      'Whole grains (quinoa, brown rice, oats)',
      'Fatty fish (salmon, mackerel)',
      'Lean proteins (chicken, turkey)',
      'Dark chocolate',
      'Nuts (brazil nuts, almonds)',
      'Olive oil',
      'Greek yogurt',
    ],
    avoid: [
      'Processed foods',
      'High-sugar snacks',
      'Excessive caffeine',
      'Alcohol',
      'Trans fats (found in many fried foods)',
    ],
  },
  'Stress': {
    take: [
      'Dark chocolate',
      'Berries (strawberries, blueberries)',
      'Green tea',
      'Oats',
      'Fatty fish (salmon)',
      'Nuts (walnuts, almonds)',
      'Bananas',
      'Leafy greens (spinach, kale)',
      'Herbal teas (chamomile, peppermint)',
    ],
    avoid: [
      'Excess caffeine',
      'Alcohol',
      'Fast food',
      'Highly processed snacks',
      'Refined carbohydrates (white bread, pastries)',
    ],
  },
};

const App = () => {
  const [selectedSymptom, setSelectedSymptom] = useState(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // Animation values for header
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [120, 60], // Adjust these values based on your design
    extrapolate: 'clamp'
  });
  
  const titleScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.8], // Reduce title size on scroll
    extrapolate: 'clamp'
  });
  
  const titleOpacity = scrollY.interpolate({
    inputRange: [0, 50, 100],
    outputRange: [1, 0.5, 0], // Fade out subtitle on scroll
    extrapolate: 'clamp'
  });
  
  const subtitleOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" />
      <LinearGradient 
        colors={['#4776E6', '#8E54E9']} // Blue to purple gradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        {/* Animated Header */}
        <Animated.View style={[styles.header, { height: headerHeight }]}>
          <Animated.Text style={[styles.title, { transform: [{ scale: titleScale }] }]}>
            Mental Health Nutrition Guide
          </Animated.Text>
          <Animated.Text style={[styles.subtitle, { opacity: subtitleOpacity }]}>
            Select a condition to see dietary recommendations
          </Animated.Text>
        </Animated.View>
        
        <Animated.ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16} // Important for smooth animation
        >
          {/* Add extra padding to account for header */}
          <View style={{ paddingTop: 10 }}>
            {symptomsData.map((symptom, index) => (
              <View key={index} style={styles.cardWrapper}>
                <TouchableOpacity
                  style={[
                    styles.card,
                    selectedSymptom === symptom.title && styles.selectedCard
                  ]}
                  activeOpacity={0.7}
                  onPress={() =>
                    setSelectedSymptom(selectedSymptom === symptom.title ? null : symptom.title)
                  }
                >
                  <Text style={[
                    styles.symptomTitle,
                    selectedSymptom === symptom.title && styles.selectedSymptomTitle
                  ]}>
                    {symptom.title}
                  </Text>
                  <Text style={styles.tapPrompt}>
                    {selectedSymptom === symptom.title ? 'Tap to close' : 'Tap for recommendations'}
                  </Text>
                </TouchableOpacity>

                {selectedSymptom === symptom.title && (
                  <View style={styles.detailsContainer}>
                    <View style={styles.recommendationSection}>
                      <View style={styles.sectionHeader}>
                        <View style={[styles.indicator, styles.takeIndicator]} />
                        <Text style={styles.foodTitle}>Foods to Include</Text>
                      </View>
                      {foodRecommendations[symptom.title].take.map((food, idx) => (
                        <View key={idx} style={styles.foodItemContainer}>
                          <View style={styles.bullet} />
                          <Text style={styles.foodItem}>{food}</Text>
                        </View>
                      ))}
                    </View>
                    
                    <View style={styles.divider} />
                    
                    <View style={styles.recommendationSection}>
                      <View style={styles.sectionHeader}>
                        <View style={[styles.indicator, styles.avoidIndicator]} />
                        <Text style={styles.foodTitle}>Foods to Avoid</Text>
                      </View>
                      {foodRecommendations[symptom.title].avoid.map((food, idx) => (
                        <View key={idx} style={styles.foodItemContainer}>
                          <View style={styles.bullet} />
                          <Text style={styles.foodItem}>{food}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            ))}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Always consult healthcare professionals before making dietary changes
              </Text>
            </View>
          </View>
        </Animated.ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  scrollView: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#ffffff',
    marginTop: 8,
    opacity: 0.9,
  },
  cardWrapper: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  selectedCard: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  symptomTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedSymptomTitle: {
    color: '#4776E6',
  },
  tapPrompt: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  detailsContainer: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    padding: 18,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  recommendationSection: {
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  takeIndicator: {
    backgroundColor: '#4CAF50', // Green
  },
  avoidIndicator: {
    backgroundColor: '#F44336', // Red
  },
  foodTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  foodItemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
    paddingLeft: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#888',
    marginTop: 7,
    marginRight: 8,
  },
  foodItem: {
    fontSize: 16,
    color: '#444',
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 15,
  },
  footer: {
    marginTop: 10,
    marginBottom: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
});

export default App;