import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import Colors from '../constants/colors';

const MainButton = props => {
	return (
		// activeOpacity sets the opacity of the touch response (user presses the button)
		<TouchableOpacity activeOpacity={0.7} onPress={props.onPress}>
			<View style={styles.button}>
				<Text style={styles.buttonText}>{props.children}</Text>
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
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