import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
// font utility to load custom fonts. (run 'expo install expo-font' if not available)
import * as Font from 'expo-font';
// AppLoading handles async calls. when the app loads with the splash screen,
// this will prolongue that state until everything has completed its process,
// and the app is ready to display to the user.
import { AppLoading } from 'expo';

import Header from './components/Header';
import StartGameScreen from './components/screens/StartGameScreen';
import GameScreen from './components/screens/GameScreen';
import GameOverScreen from './components/screens/GameOverScreen';

// created outside of the App component because it doesn't need to be part
// of the re-render cycle.
// returns a promise, therefore fetchFonts returns the loadAsync call to
// hold off on rendering anything until this method has completed.
const fetchFonts = () => {
  // tell expo which fonts to load for this app
  // expo currently does not support fontWeight for custom fonts, so 
  // must load individual font types
  return Font.loadAsync({
    'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf')
  });
}

export default function App() {
  const [userNumber, setUserNumber] = useState();
  const [guessRounds, setGuessRounds] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);

  // stop the app from loading until ready
  if (!dataLoaded) {
    // startAsync can only accept functions that return a promise
    // when finished, it will pass to onFinish (equivelent to .then() )
    return <AppLoading startAsync={fetchFonts} onFinish={() => setDataLoaded(true)} onError={(e) => console.log(e)} />;
  }

  const configureNewGameHandler = () => {
    setGuessRounds(0);
    setUserNumber(null);
  }

  const startGameHandler = (selectedNumber) => {
    setUserNumber(selectedNumber);
    setGuessRounds(0);
  }

  const gameOverHandler = numberOfRounds => {
    setGuessRounds(numberOfRounds);
  }

  // startGameHandler gets passed down to the StartGameScreen component
  // so that userNumber is updated within the StartGameScreen view
  let content = <StartGameScreen onStartGame={startGameHandler} />;

  // if user chose a number, set the content to GameScreen
  if (userNumber && guessRounds <= 0) {
    content = <GameScreen userChoice={userNumber} onGameOver={gameOverHandler}/>;
  } else if (guessRounds > 0) {
    content = <GameOverScreen roundsNumber={guessRounds} userNumber={userNumber} onRestart={configureNewGameHandler} />;
  }

  return (
    <SafeAreaView style={styles.screen}>
        <Header title="Guess a Number" />
        {content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    // making the parent view flex 1 will tell it to take the max space
    // because it is the parent view, it does not need to share the space
    // with any other elements, so it will be max height and width
    flex: 1
  }
});
