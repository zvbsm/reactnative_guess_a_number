import React from 'react';
import { Text, StyleSheet } from 'react-native';

// cascade style properties throughout app
const BodyText = props => <Text style={{ ...styles.body, ...props.style }}>{props.children}</Text>;

const styles = StyleSheet.create({
	body: {
		fontFamily: 'open-sans'
	}
});

export default BodyText;
