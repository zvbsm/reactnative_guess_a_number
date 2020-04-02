import React from 'react';
import { View, StyleSheet } from 'react-native';

const Card = props => {
	// by using ... it tells it to pull all child elements in this object and apply them to a new one
	// then merge with the props style in that new object
	// this allows for establishing these attributes as a base style and 
	// still be able to customize the card if needed in the view that the card is added to
	return <View style={{...styles.card, ...props.style}}>{props.children}</View>
}

const styles = StyleSheet.create({
	card: {
		shadowColor: 'black',
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 6,
		shadowOpacity: 0.26,
		elevation: 5,
		backgroundColor: 'white',
		padding: 20,
		borderRadius: 10
	}
});

export default Card;