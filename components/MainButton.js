import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, TouchableNativeFeedback } from 'react-native';

import Colors from '../constants/colors';

const MainButton = props => {
	let ButtonComponent = TouchableOpacity;
	if (Platform.OS === 'android' && Platform.Version >= 21) {
		ButtonComponent = TouchableNativeFeedback;
	}

	return (
		// wrapping the button in a View to handle the android ripple effect not respecting border radius
		<View style={styles.buttonContainer}>
			{/* activeOpacity sets the opacity of the touch response (user presses the button)*/}
			<ButtonComponent activeOpacity={0.7} onPress={props.onPress}>
				<View style={styles.button}>
					<Text style={styles.buttonText}>{props.children}</Text>
				</View>
			</ButtonComponent>
		</View>
	);
}

const styles = StyleSheet.create({
	buttonContainer: {
		borderRadius: 25,
		overflow: "hidden"
	},
	button: {
		backgroundColor: Colors.primary,
		paddingVertical: 12,
		paddingHorizontal: 30,
		borderRadius: 25
	},
	buttonText: {
		color: 'white',
		fontFamily: 'open-sans',
		fontSize: 18
	}
});

export default MainButton;