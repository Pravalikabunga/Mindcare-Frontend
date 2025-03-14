import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  Animated, 
  Alert,
  SafeAreaView,
  StatusBar,
  ScrollView
} from 'react-native';

const { width, height } = Dimensions.get('window');

const StressReliefGames = () => {
  const [currentGame, setCurrentGame] = useState('menu');
  const [difficulty, setDifficulty] = useState('medium'); // 'easy', 'medium', 'hard'

  // Function to render the appropriate game based on selection
  const renderGame = () => {
    switch(currentGame) {
      case 'bubblepop':
        return <BubblePop onBack={() => setCurrentGame('menu')} difficulty={difficulty} />;
      case 'breathing':
        return <BreathingExercise onBack={() => setCurrentGame('menu')} difficulty={difficulty} />;
      case 'colormatch':
        return <ColorMatch onBack={() => setCurrentGame('menu')} difficulty={difficulty} />;
      case 'difficulty':
        return <DifficultySelector 
                  onSelectDifficulty={(level) => {
                    setDifficulty(level);
                    setCurrentGame('menu');
                  }} 
                  currentDifficulty={difficulty}
                  onBack={() => setCurrentGame('menu')}
               />;
      default:
        return <GameMenu 
                  onSelectGame={setCurrentGame} 
                  currentDifficulty={difficulty}
               />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {renderGame()}
    </SafeAreaView>
  );
};

// Difficulty Selector Component
const DifficultySelector = ({ onSelectDifficulty, currentDifficulty, onBack }) => {
  return (
    <View style={difficultyStyles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>← Back to Menu</Text>
      </TouchableOpacity>
      
      <Text style={difficultyStyles.title}>Select Difficulty</Text>
      <Text style={difficultyStyles.subtitle}>Choose a level that suits you</Text>
      
      <View style={difficultyStyles.optionsContainer}>
        <DifficultyOption 
          title="Easy" 
          description="Perfect for beginners, relaxing pace"
          color="#2ecc71"
          isSelected={currentDifficulty === 'easy'}
          onPress={() => onSelectDifficulty('easy')}
        />
        <DifficultyOption 
          title="Medium" 
          description="Balanced challenge for most users"
          color="#3498db"
          isSelected={currentDifficulty === 'medium'}
          onPress={() => onSelectDifficulty('medium')}
        />
        <DifficultyOption 
          title="Hard" 
          description="Intense focus and quick reflexes needed"
          color="#e74c3c"
          isSelected={currentDifficulty === 'hard'}
          onPress={() => onSelectDifficulty('hard')}
        />
      </View>
    </View>
  );
};

// Difficulty Option Component
const DifficultyOption = ({ title, description, color, isSelected, onPress }) => {
  return (
    <TouchableOpacity 
      style={[
        difficultyStyles.option,
        { backgroundColor: color },
        isSelected && difficultyStyles.selectedOption
      ]}
      onPress={onPress}
    >
      <Text style={difficultyStyles.optionTitle}>{title}</Text>
      <Text style={difficultyStyles.optionDescription}>{description}</Text>
      {isSelected && (
        <View style={difficultyStyles.selectedIndicator}>
          <Text style={difficultyStyles.selectedText}>✓ Selected</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

// Main Menu Component
const GameMenu = ({ onSelectGame, currentDifficulty }) => {
  const getDifficultyColor = () => {
    switch(currentDifficulty) {
      case 'easy': return '#2ecc71';
      case 'hard': return '#e74c3c';
      default: return '#3498db'; // medium
    }
  };

  return (
    <View style={menuStyles.container}>
      <Text style={menuStyles.title}>Stress Relief Games</Text>
      <Text style={menuStyles.subtitle}>Choose a game to unwind</Text>
      
      <TouchableOpacity 
        style={[menuStyles.difficultyBadge, { backgroundColor: getDifficultyColor() }]}
        onPress={() => onSelectGame('difficulty')}
      >
        <Text style={menuStyles.difficultyText}>
          {currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1)} Difficulty
        </Text>
      </TouchableOpacity>
      
      <ScrollView contentContainerStyle={menuStyles.gamesContainer}>
        <GameOption 
          title="Bubble Pop" 
          description="Pop colorful bubbles to release tension"
          color="#e74c3c"
          onPress={() => onSelectGame('bubblepop')}
        />
        <GameOption 
          title="Breathing Exercise" 
          description="Guided breathing to reduce anxiety"
          color="#2ecc71"
          onPress={() => onSelectGame('breathing')}
        />
        <GameOption 
          title="Color Match" 
          description="Match colors to improve focus and memory"
          color="#9b59b6"
          onPress={() => onSelectGame('colormatch')}
        />
      </ScrollView>
    </View>
  );
};

// Game Option Component for the menu
const GameOption = ({ title, description, color, onPress }) => {
  return (
    <TouchableOpacity 
      style={[menuStyles.gameOption, { backgroundColor: color }]}
      onPress={onPress}
    >
      <Text style={menuStyles.gameTitle}>{title}</Text>
      <Text style={menuStyles.gameDescription}>{description}</Text>
    </TouchableOpacity>
  );
};


// 1. BUBBLE POP GAME
const BubblePop = ({ onBack }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [bubbles, setBubbles] = useState([]);
  const [gameActive, setGameActive] = useState(false);

  // Start the game
  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setBubbles([]);
    setGameActive(true);
  };

  // Generate random bubble
  const generateBubble = () => {
    const id = Date.now().toString();
    const size = Math.floor(Math.random() * 50) + 30; // 30-80px
    const bubble = {
      id,
      x: Math.random() * (width - size),
      y: Math.random() * (height / 2) + height / 4,
      size,
      color: `hsl(${Math.floor(Math.random() * 360)}, 80%, 70%)`,
    };
    setBubbles(currentBubbles => [...currentBubbles, bubble]);
    
    // Remove bubble after some time if not popped
    setTimeout(() => {
      setBubbles(currentBubbles => currentBubbles.filter(b => b.id !== id));
    }, 3000);
  };

  // Handle bubble pop
  const popBubble = (id) => {
    setBubbles(currentBubbles => currentBubbles.filter(bubble => bubble.id !== id));
    setScore(currentScore => currentScore + 1);
  };

  // Game timer
  useEffect(() => {
    let timer;
    let bubbleGenerator;

    if (gameActive) {
      timer = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setGameActive(false);
            clearInterval(timer);
            clearInterval(bubbleGenerator);
            return 0;
          }
          return time - 1;
        });
      }, 1000);

      bubbleGenerator = setInterval(generateBubble, 500);
    }

    return () => {
      clearInterval(timer);
      clearInterval(bubbleGenerator);
    };
  }, [gameActive]);

  return (
    <View style={bubbleStyles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>← Back to Menu</Text>
      </TouchableOpacity>
      
      <Text style={bubbleStyles.title}>Bubble Pop</Text>
      
      {!gameActive && timeLeft === 0 ? (
        <View style={bubbleStyles.gameOver}>
          <Text style={bubbleStyles.gameOverText}>Game Over!</Text>
          <Text style={bubbleStyles.finalScoreText}>Final Score: {score}</Text>
          <TouchableOpacity style={bubbleStyles.playButton} onPress={startGame}>
            <Text style={bubbleStyles.playButtonText}>Play Again</Text>
          </TouchableOpacity>
        </View>
      ) : !gameActive ? (
        <View style={bubbleStyles.startScreen}>
          <Text style={bubbleStyles.instructions}>
            Pop as many bubbles as you can in 30 seconds to relieve stress!
          </Text>
          <TouchableOpacity style={bubbleStyles.playButton} onPress={startGame}>
            <Text style={bubbleStyles.playButtonText}>Start Game</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={bubbleStyles.gameArea}>
          <View style={bubbleStyles.statsContainer}>
            <Text style={bubbleStyles.scoreText}>Score: {score}</Text>
            <Text style={bubbleStyles.timeText}>Time: {timeLeft}s</Text>
          </View>
          
          {bubbles.map(bubble => (
            <TouchableOpacity
              key={bubble.id}
              style={[
                bubbleStyles.bubble,
                {
                  left: bubble.x,
                  top: bubble.y,
                  width: bubble.size,
                  height: bubble.size,
                  borderRadius: bubble.size / 2,
                  backgroundColor: bubble.color,
                },
              ]}
              onPress={() => popBubble(bubble.id)}
            />
          ))}
        </View>
      )}
    </View>
  );
};



// 2. BREATHING EXERCISE
const BreathingExercise = ({ onBack, difficulty }) => {
  const [phase, setPhase] = useState('idle'); // idle, inhale, hold, exhale
  const [timer, setTimer] = useState(0);
  const [exerciseActive, setExerciseActive] = useState(false);
  const [cycles, setCycles] = useState(0);
  
  const animation = useRef(new Animated.Value(1)).current;
  const timerRef = useRef(null);

  // Get difficulty settings
  const getDifficultySettings = () => {
    switch(difficulty) {
      case 'easy':
        return {
          inhaleTime: 5, // More time to inhale
          holdTime: 5,   // Shorter hold time
          exhaleTime: 6, // More time to exhale
          totalCycles: 2 // Fewer cycles
        };
      case 'hard':
        return {
          inhaleTime: 4,
          holdTime: 8,   // Longer hold time
          exhaleTime: 10, // Longer exhale time
          totalCycles: 4  // More cycles
        };
      default: // medium
        return {
          inhaleTime: 4,
          holdTime: 7,
          exhaleTime: 8,
          totalCycles: 3
        };
    }
  };

  const diffSettings = getDifficultySettings();

  const startExercise = () => {
    setExerciseActive(true);
    setCycles(0);
    startCycle();
  };

  const startCycle = () => {
    setPhase('inhale');
    setTimer(diffSettings.inhaleTime);
    
    // Expand animation
    Animated.timing(animation, {
      toValue: 3,
      duration: diffSettings.inhaleTime * 1000,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (!exerciseActive) return;
    
    timerRef.current = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer <= 1) {
          // Move to next phase
          if (phase === 'inhale') {
            setPhase('hold');
            
            // Stay expanded
            Animated.timing(animation).stop();
            
            return diffSettings.holdTime; // Hold time
          } else if (phase === 'hold') {
            setPhase('exhale');
            
            // Shrink animation
            Animated.timing(animation, {
              toValue: 1,
              duration: diffSettings.exhaleTime * 1000,
              useNativeDriver: true,
            }).start();
            
            return diffSettings.exhaleTime; // Exhale time
          } else if (phase === 'exhale') {
            setCycles(prev => prev + 1);
            
            if (cycles >= diffSettings.totalCycles - 1) {
              // After cycles are complete, stop the exercise
              setExerciseActive(false);
              setPhase('idle');
              clearInterval(timerRef.current);
              return 0;
            }
            
            // Start a new cycle
            startCycle();
          }
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timerRef.current);
    };
  }, [phase, exerciseActive, cycles, diffSettings]);

  const animatedStyle = {
    transform: [{ scale: animation }],
  };

  const getInstructionText = () => {
    switch (phase) {
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
      default: return 'Ready to start';
    }
  };

  return (
    <View style={breathingStyles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>← Back to Menu</Text>
      </TouchableOpacity>
      
      <Text style={breathingStyles.title}>Breathing Exercise</Text>
      <Text style={breathingStyles.difficultyText}>
        Difficulty: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
      </Text>
      
      <View style={breathingStyles.exerciseContainer}>
        <Animated.View style={[breathingStyles.circle, animatedStyle]} />
        
        {exerciseActive && (
          <View style={breathingStyles.instructionContainer}>
            <Text style={breathingStyles.instructionText}>{getInstructionText()}</Text>
            <Text style={breathingStyles.timerText}>{timer}</Text>
          </View>
        )}
      </View>
      
      <Text style={breathingStyles.cycleText}>
        {exerciseActive ? `Cycle ${cycles + 1}/${diffSettings.totalCycles}` : 
          `Complete ${diffSettings.totalCycles} cycles to reduce stress`}
      </Text>
      
      {!exerciseActive && (
        <TouchableOpacity style={breathingStyles.startButton} onPress={startExercise}>
          <Text style={breathingStyles.startButtonText}>Start Breathing</Text>
        </TouchableOpacity>
      )}
      
      <View style={breathingStyles.infoContainer}>
        <Text style={breathingStyles.infoText}>• Breathe in for {diffSettings.inhaleTime} seconds</Text>
        <Text style={breathingStyles.infoText}>• Hold your breath for {diffSettings.holdTime} seconds</Text>
        <Text style={breathingStyles.infoText}>• Exhale for {diffSettings.exhaleTime} seconds</Text>
        <Text style={breathingStyles.infoText}>• Repeat {diffSettings.totalCycles} times for optimal stress relief</Text>
      </View>
    </View>
  );
};

// 3. COLOR MATCH GAME
const ColorMatch = ({ onBack, difficulty }) => {
  // Different color sets for different difficulties
  const DIFFICULTY_SETTINGS = {
    easy: {
      colors: ['#FF5733', '#33FF57', '#3357FF', '#FF33A8'],
      pairsToMatch: 4,
      timeLimit: null // No time limit
    },
    medium: {
      colors: ['#FF5733', '#33FF57', '#3357FF', '#FF33A8', '#33A8FF', '#A833FF', '#FFC133', '#33FFC1'],
      pairsToMatch: 8,
      timeLimit: null
    },
    hard: {
      colors: [
        '#FF5733', '#33FF57', '#3357FF', '#FF33A8', '#33A8FF', 
        '#A833FF', '#FFC133', '#33FFC1', '#FFB5E8', '#B28DFF',
        '#85E3FF', '#BFFCC6'
      ],
      pairsToMatch: 12,
      timeLimit: 60 // 60 second time limit
    }
  };

  const diffSettings = DIFFICULTY_SETTINGS[difficulty];
  const COLORS = diffSettings.colors;

  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(diffSettings.timeLimit);

  useEffect(() => {
    let timer;
    
    if (gameStarted && diffSettings.timeLimit && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Time's up
            clearInterval(timer);
            if (!gameComplete) {
              setGameComplete(true);
              Alert.alert(
                'Time\'s Up!',
                `You matched ${matchedPairs} out of ${COLORS.length} pairs.`,
                [{ text: 'Try Again', onPress: initializeGame }]
              );
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(timer);
  }, [gameStarted, timeLeft]);

  const initializeGame = () => {
    // Create pairs of colors and shuffle them
    const colorPairs = [...COLORS, ...COLORS];
    const shuffledColors = shuffleArray(colorPairs);
    
    // Create card objects
    const newCards = shuffledColors.map((color, index) => ({
      id: index,
      color: color,
      isFlipped: false,
      isMatched: false
    }));
    
    setCards(newCards);
    setFlippedIndices([]);
    setMatchedPairs(0);
    setMoves(0);
    setGameStarted(true);
    setGameComplete(false);
    setTimeLeft(diffSettings.timeLimit);
  };

  // Fisher-Yates shuffle algorithm
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Handle card flip
  const handleCardPress = (index) => {
    // Ignore if the card is already flipped or matched
    if (cards[index].isFlipped || cards[index].isMatched) {
      return;
    }
    
    // Ignore if two cards are already flipped
    if (flippedIndices.length === 2) {
      return;
    }
    
    // Flip the card
    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);
    
    // Add this card to flipped cards
    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);
    
    // If two cards are flipped, check for a match
    if (newFlippedIndices.length === 2) {
      setMoves(moves + 1);
      
      const [firstIndex, secondIndex] = newFlippedIndices;
      
      if (cards[firstIndex].color === cards[secondIndex].color) {
        // Match found
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[firstIndex].isMatched = true;
          matchedCards[secondIndex].isMatched = true;
          setCards(matchedCards);
          setFlippedIndices([]);
          setMatchedPairs(matchedPairs + 1);
          
          // Check if all pairs are matched
          if (matchedPairs + 1 === COLORS.length) {
            setGameComplete(true);
            Alert.alert(
              'Congratulations!',
              `You completed the game in ${moves + 1} moves!`,
              [{ text: 'Play Again', onPress: initializeGame }]
            );
          }
        }, 500);
      } else {
        // No match, flip cards back
        // Hard mode flips back faster
        const flipBackTime = difficulty === 'hard' ? 600 : difficulty === 'medium' ? 1000 : 1500;
        setTimeout(() => {
          const newCards = [...cards];
          newCards[firstIndex].isFlipped = false;
          newCards[secondIndex].isFlipped = false;
          setCards(newCards);
          setFlippedIndices([]);
        }, flipBackTime);
      }
    }
  };

  return (
    <View style={colorMatchStyles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>← Back to Menu</Text>
      </TouchableOpacity>
      
      <Text style={colorMatchStyles.title}>Color Match</Text>
      <Text style={colorMatchStyles.difficultyText}>
        Difficulty: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
      </Text>
      
      {!gameStarted ? (
        <View style={colorMatchStyles.startScreen}>
          <Text style={colorMatchStyles.instructionText}>
            Match pairs of colors to relieve stress and improve memory.
            {difficulty === 'hard' ? "\n\nHard mode has a time limit of 60 seconds!" : ""}
          </Text>
          <TouchableOpacity style={colorMatchStyles.startButton} onPress={initializeGame}>
            <Text style={colorMatchStyles.startButtonText}>Start Game</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={colorMatchStyles.statsContainer}>
            <Text style={colorMatchStyles.statsText}>Pairs: {matchedPairs}/{COLORS.length}</Text>
            <Text style={colorMatchStyles.statsText}>Moves: {moves}</Text>
            {diffSettings.timeLimit && (
              <Text style={[
                colorMatchStyles.statsText, 
                timeLeft <= 10 && colorMatchStyles.urgentText
              ]}>
                Time: {timeLeft}s
              </Text>
            )}
          </View>
          
          <View style={[
            colorMatchStyles.gridContainer,
            difficulty === 'hard' && { maxWidth: width * 0.95 }
          ]}>
            {cards.map((card, index) => (
              <TouchableOpacity
                key={card.id}
                style={[
                  colorMatchStyles.card,
                  difficulty === 'hard' && { width: 60, height: 60, margin: 4 },
                  card.isFlipped || card.isMatched
                    ? { backgroundColor: card.color }
                    : { backgroundColor: '#dcdde1' }
                ]}
                onPress={() => handleCardPress(index)}
                disabled={gameComplete || timeLeft === 0}
              />
            ))}
          </View>
          
          <TouchableOpacity style={colorMatchStyles.resetButton} onPress={initializeGame}>
            <Text style={colorMatchStyles.resetButtonText}>Reset Game</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

// Shared Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  backButton: {
    padding: 15,
    margin: 5,
  },
  backButtonText: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: 'bold',
  },
});

// Difficulty selector styles
const difficultyStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#7f8c8d',
    marginBottom: 30,
  },
  optionsContainer: {
    paddingHorizontal: 20,
    width: '100%',
  },
  option: {
    width: '100%',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedOption: {
    borderWidth: 3,
    borderColor: '#fff',
  },
  optionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  optionDescription: {
    fontSize: 16,
    color: 'white',
    opacity: 0.8,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  selectedText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

// Menu-specific styles
const menuStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:'flex-center',
    alignItems: 'center',
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#7f8c8d',
    marginBottom: 20,
  },
  difficultyBadge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 30,
  },
  difficultyText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  gamesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    justifyContent:'flex-center',
    alignItems:'center',
  },
  gameOption: {
    width: width - 40,
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gameTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  gameDescription: {
    fontSize: 16,
    color: 'white',
    opacity: 0.8,
  },
});



// Bubble Pop Game styles
const bubbleStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
    color: '#3498db',
  },
  gameArea: {
    flex: 1,
    position: 'relative',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  timeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  bubble: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  startScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  instructions: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  playButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  playButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameOver: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 20,
  },
  finalScoreText: {
    fontSize: 24,
    marginBottom: 30,
    color: '#333',
  },
});

// Breathing Exercise styles
const breathingStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 0,
    color: '#3498db',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 40,
    color: '#7f8c8d',
  },
  exerciseContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 250,
    width: 250,
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#3498db',
    opacity: 0.7,
  },
  instructionContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  timerText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  cycleText: {
    fontSize: 16,
    marginTop: 20,
    color: '#7f8c8d',
  },
  startButton: {
    marginTop: 15,
    backgroundColor: '#2ecc71',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoContainer: {
    marginTop: 5,
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
  },
  infoText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 10,
  },
});

// Color Match Game styles
const colorMatchStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
  },
  startScreen: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  instructionText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    color: '#2c3e50',
  },
  startButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  statsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '90%',
    marginBottom: 20,
  },
  card: {
    width: 70,
    height: 70,
    margin: 1,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#7f8c8d',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  resetButton: {
    marginTop: 5,
    padding: 15,
    backgroundColor: '#e74c3c',
    borderRadius: 5,
  },
  resetButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

// Export individual components for use in other files
export { BubblePop, BreathingExercise, ColorMatch, GameMenu };

// Export the main component as default
export default StressReliefGames;