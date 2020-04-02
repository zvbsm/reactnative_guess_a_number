import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import Colors from '../constants/colors';
import TitleText from './TitleText';

const Header = props => {
	return (
		<View style={styles.header}>
			<TitleText style={styles.title}>{props.title}</TitleText>
		</View>
	)
}

const styles = StyleSheet.create({
	header: {
		width: '100%',
		height: 90,
		paddingTop: 36,
		backgroundColor: Colors.primary,
		// alignItems on the parent and justifyContent on the 
		// children is used to center/align items using flexbox properties
		// alignItems will align horizontally
		alignItems: 'center',
		// justifyContent will align vertically
		justifyContent: 'center'
	}
});

export default Header;