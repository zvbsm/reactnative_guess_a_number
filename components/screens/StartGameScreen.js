import React, { useState, useEffect } from 'react';

import { 
	View, 
	Text, 
	StyleSheet, 
	Button, 
	// "withoutFeedback" means that the UI does not show any indicator of the touch event happening
	TouchableWithoutFeedback, 
	Keyboard, 
	Alert,
	// Dimensions only calculated when app is initialized. Does not recalculate on screen rotations
	Dimensions,
	ScrollView,
	KeyboardAvoidingView
} from 'react-native';

import Card from '../Card';
import Colors from '../../constants/colors';
import Input from '../Input';
import NumberContainer from '../NumberContainer';
import BodyText from '../BodyText';
import TitleText from '../TitleText';
import MainButton from '../MainButton';

const StartGameScreen = props => {

	// useState enables 2-way data binding?
	const [enteredValue, setEnteredValue ] = useState('');
	const [confirmed, setConfirmed] = useState(false);
	const [selectedNumber, setSelectedNumber] = useState();
	// useState to recalculate dimensions on screen rotation
	const [buttonWidth, setButtonWidth] = useState(Dimensions.get('window').width / 4);

	useEffect(() => {
		const updateLayout = () => {
			setButtonWidth(Dimensions.get('window').width / 4);
		}
		// run updateLayout when change event is triggered
		Dimensions.addEventListener('change', updateLayout);
		return () => {
			// When the device rotates again, the event listener must be removed
			// because a new one gets created. this will ensure only 1 event listener exists
			Dimensions.removeEventListener('change', updateLayout);
		}
	});

	const numberInputHandler = inputText => {
		// number/number-pad - set on the keyboardType removes the decimal from ios
		// but not android. so need to manually replace anything not a number with empty string.
		setEnteredValue(inputText.replace(/[^0-9]/g, ''));
	}

	const resetInputHandler = () => {
		setEnteredValue('');
		setConfirmed(false);
	}

	const confirmInputHandler = () => {
		// additional validation to ensure the string being parsed is in fact a valid number
		// if it fails, the function will return/ do nothing
		const chosenNumber = parseInt(enteredValue);
		if (isNaN(chosenNumber) || chosenNumber <= 0 || chosenNumber > 99) {
			Alert.alert('Invalid Number', 'Number must be between 0-99.', [
				{
					text: 'Okay', 
					style: 'destructive', 
					onPress: resetInputHandler
				}]);
			return;
		}
		setConfirmed(true);
		// setting the value to an empty string doesnt happen until the next render cycle
		// so its ok to declare this before setting the selected number, because the value 
		// will still exist in this render cycle.
		setEnteredValue('');
		setSelectedNumber(chosenNumber);
		Keyboard.dismiss();
	}

	let confirmedOutput;

	if (confirmed) {
		// onStartGame is a prop passed by App.js for managing
		// the state on App.js from the StartGameScreen component
		confirmedOutput = (
			<Card style={styles.summaryContainer}>
				<BodyText>You Selected:</BodyText>
				<NumberContainer>{selectedNumber}</NumberContainer>
				<MainButton
					// because the MainButton component is set to receive props.children
					// the button is no longer a self closing element with a title set as below. 
					onPress={() => props.onStartGame(selectedNumber)}>Start Game</MainButton>
				{/* <Button title="START GAME" onPress={() => props.onStartGame(selectedNumber)}/> */}
			</Card>
		);
	}

	// Input - can accept attributes like blureOnSubmit, keyboardType, etc. because
	// {...props} was added to the component in the component's file
	// blurOnSubmit - works for android pressing enter, but same button doesnt 
	// exist for ios so need alternate solution for ios

	return (
		<ScrollView>
			{/*
			- behavior="height" re-adjusts the entire height of the view
			- behavior="padding" would add padding to the bottom of view (best for android)
			- behavior="position" tells it to reposition the entire screen (best for iOS)
			- keyboardVerticalOffest is used to adjust how far the view should move
			*/}
			<KeyboardAvoidingView behavior="position" keyboardVerticalOffset={30}>
				<TouchableWithoutFeedback onPress={() => {
					Keyboard.dismiss();
				}}>
					<View style={styles.screen}>
						<TitleText style={styles.title}>Start New Game</TitleText>
						<Card style={styles.inputContainer}>
							<BodyText style={styles.text}>Select a Number</BodyText>
							<Input
								style={styles.input}
								blurOnSubmit
								autoCorrect={false}
								keyboardType="numeric"
								maxLength={2}
								onChangeText={numberInputHandler}
								value={enteredValue}
							/>
							<View style={styles.buttonContainer}>
								<View style={{ width: buttonWidth }}>
									<Button
										title="Reset"
										onPress={resetInputHandler}
										color={Colors.accent}
									/>
								</View>
								<View style={{ width: buttonWidth }}>
									<Button
										title="Confirm"
										onPress={confirmInputHandler}
										color={Colors.primary}
									/>
								</View>
							</View>
						</Card>
						{confirmedOutput}
					</View>
				</TouchableWithoutFeedback>
			</KeyboardAvoidingView>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	screen: {
		// flex 1 doesnt show this view in ios
		// flex: 1,
		padding: 10,
		alignItems: 'center'
	},
	title: {
		fontSize: 20,
		marginVertical: 10,
		fontFamily: 'open-sans'
	},
	inputContainer: {
		width: '80%',
		maxWidth: '95%',
		minWidth: 300,
		// centers the items horizontally, this is still a flexDirection of column
		alignItems: 'center',
		// shadow only works on iOS
		shadowColor: 'black',
	},
	buttonContainer: {
		// default is column
		flexDirection: 'row',
		width: '100%',
		// distributes all available space between the elements
		justifyContent: 'space-between',
		paddingHorizontal: 15
	},
	buttonView: {
		// screen vs window only matters on Android. Window will exclude status bar height from calculation.
		// window should be used in both iOS and Android to get the actual available space
		width: Dimensions.get('window').width / 4
	},
	input: {
		width: 50,
		textAlign: 'center'
	},
	summaryContainer: {
		marginTop: 20,
		alignItems: 'center'
	}
});

export default StartGameScreen;