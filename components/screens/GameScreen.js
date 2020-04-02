import React, { useState, useRef, useEffect } from 'react';
// useRef - hook that allows to create object you can bind to inputs
// also allows to define value that survives re-rendering
import { View, Text, StyleSheet, Alert, ScrollView, FlatList } from 'react-native';
// vector-icons allows for rendering vector images/icons and access to icon components
import { Ionicons } from '@expo/vector-icons';

import NumberContainer from '../NumberContainer';
import Card from '../Card';
import DefaultStyles from '../../constants/default-styles';
import MainButton from '../MainButton';
import BodyText from '../BodyText';

const generateRandomBetween = (min, max, exclude) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	const randomNumber = Math.floor(Math.random() * (max - min)) + min;
	if (randomNumber === exclude) {
		return generateRandomBetween(min, max, exclude);
	} else {
		return randomNumber;
	}
}

// function outside of GameScreen because it does not need anything in the GameScreen
// component to run
const renderListItem = (listLength, itemData) => (
	<View style={styles.listItem}>
		<BodyText>#{listLength - itemData.index}</BodyText>
		<BodyText>{itemData.item}</BodyText>
	</View>
);


const GameScreen = props => {
	const initialGuess = generateRandomBetween(1, 100, props.userChoice);
	// useState reruns when component rerenders, but react detects a state has already been initialized
	// so it only sets the state for this component the first time it runs, because it will see the initial
	// state already has been created when re-rendering. 
	const [currentGuess, setCurrentGuess] = useState(initialGuess);
	const [pastGuesses, setPastGuesses] = useState([initialGuess.toString()]);

	// set the initial value for the useRef object;
	// useRef objects come with a "current" key where you would store
	// the current value in comparison to the original/initial value that is set here.
	// useRef stores the object seperately from the component, so when the component is 
	// re-rendered, it does not impact the useRef object. Whereas useState will be
	// re-rendered with the component.
	// These values should be stored seperately from the component because it is only a
	// change to the logic and has no impact on the view. Therefore, unnecessary to trigger
	// a UI re-render from the change of these values.
	const currentLow = useRef(1);
	const currentHigh = useRef(100);

	// object destructuring
	// taking the variables from props and storing them in an object with the same names
	// useEffect would then refer to use "userChoice" for example instead of  "props.userChoice"
	// this allows for adding userChoice and onGameOver as inputs in useEffect. otherwise,
	// would have to add props as the input which changes when the parent component changes.
	// only want to watch for changes occuring within these two.
	const { userChoice, onGameOver } = props;

	// useEffect runs after every render cycle, and will check if conditions 
	// are met to trigger the effect.
	useEffect(() => {
		//effect
		if (currentGuess === userChoice) {
			onGameOver(pastGuesses.length);
		}
		// return () => {
		//		cleanup
		// }

		// input the array of dependancies for this function
		// anytime these inputs change, useEffect will run
		// if the values are still the same as the previous re-render cycle, then useEffect will not run.
	}, [currentGuess, userChoice, onGameOver]);

	const nextGuessHandler = direction => {
		// if the user pressed the lower button, but the npc guessed a number lower than the user's choice
		// or user pressed greater and npc guessed a number greater than the choice
		// then the user has giving the npc an invalid hint.
		if ((direction === 'lower' && currentGuess < props.userChoice) || (direction === 'greater' && currentGuess > props.userChoice)) {
			Alert.alert('Don\'t lie!', 'You provided an innacurate hint.', [
				{ text: 'Sorry!', style: 'cancel' }
			]);
			return;
		}
		if (direction === 'lower') {
			currentHigh.current = currentGuess;
		} else {
			currentLow.current = currentGuess + 1;
		}
		const nextNumber = generateRandomBetween(currentLow.current, currentHigh.current, currentGuess);
		setCurrentGuess(nextNumber);

		// setting past guesses consists of creating a new list that takes the existing list and adds
		// nextNumber (the next guess) to the front of the list.
		// currentGuess would not work because React wouldn't have updated the state and re-rendered the component yet.
		setPastGuesses(currentPastGuesses => [nextNumber.toString(), ...currentPastGuesses])
	}

	// nextGuessHandler is set to trigger when the button is pressed, but uses
	// bind to preconfigure the argument that will be passed to nextGuessHandler
	// when the method is executed. ("this" refers to GameScreen class?)
	// then specify the first argument received by the method (e.g. direction).
	return (
		<View style={styles.screen}>
			<Text style={DefaultStyles.titleText}>Opponent's Guess</Text>
			<NumberContainer>{currentGuess}</NumberContainer>
			<Card style={styles.buttonContainer}>
				<MainButton onPress={nextGuessHandler.bind(this, 'lower')}>
					<Ionicons name="md-remove" size={24} color="white"/>
				</MainButton>
				<MainButton onPress={nextGuessHandler.bind(this, 'greater')}>
					<Ionicons name="md-add" size={24} color="white"/>
				</MainButton>
			</Card>
			{/* ScrollView on android needs it's parent container to have a style property
			 of flex: 1 in order to be scrollable */}
			<View style={styles.listContainer}>
				{/* for each guess in the list, create a view+text component */}
				{/* <ScrollView contentContainerStyle={styles.list}>{pastGuesses.map((guess, index) => renderListItem(guess, pastGuesses.length - index))}</ScrollView> */}

				{/* compare FlatList to ScrollView, FlatList is more performance-optimized (good for long lists or unknown-length of lists).
				FlatList could be compared to a recyclerview where content is only generated when needed. ScrollView will generate all content regardless.
				 - keyExtractor is used to manually tell the FlatList what to refer to as a key for each item
				 - renderListItem.bind() to specify additional arguments to pass aside from the default arguments
				 - binding pastGuesses does not need "- index" because dont have access to index anymore from map()
				 so, it will be done within the renderListItem method itself where the number of rounds is displayed.
				 where itemData is automatically assigned in index by react.
				 - renderListItem would pass the listItem argument by default via the renderItem prop, 
				 so it is listed secondly in the renderListItem method. the bind action puts the additional arguments
				 first, and the default arguments afterwards, hence why renderListItem is set up with listLength first,
				 and itemData second in the method itself.*/}
				<FlatList 
					keyExtractor={(item) => item} 
					data={pastGuesses} 
					renderItem={renderListItem.bind(this, pastGuesses.length)}
					contentContainerStyle={styles.list}
				/>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		padding: 10,
		alignItems: 'center'
	},
	buttonContainer: {
		flexDirection: 'row',
		// free space around the buttons on left and right equally distributed
		justifyContent: 'space-around',
		marginTop: 20,
		width: 400,
		maxWidth: '90%'
	},
	listContainer: {
		width: '60%',
		flex: 1
	},
	list: {
		// flexGrow alternative to flex: 1, because flex only tells the items to fill the
		// available space, flexGrow will fill plus handle content exceeding the boundries
		// of the view.
		flexGrow: 1,
		// alignItems for ScrollView, which is now replaced with FlatList
		// alignItems: 'center',
		// default is flex-start. items start at bottom instead of default top/beginning
		justifyContent: 'flex-end'
	},
	listItem: {
		borderColor: '#ccc',
		borderWidth: 1,
		padding: 15,
		marginVertical: 10,
		backgroundColor: 'white',
		flexDirection: 'row',
		// since flexDirection is set to row, justifyContent will affect the horizontal/row axis
		justifyContent: 'space-between',
		width: '100%'
	}
});

export default GameScreen;