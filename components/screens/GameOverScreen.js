import React from 'react';
import { View, StyleSheet, Button, Image, Text } from 'react-native';

import BodyText from '../BodyText';
import TitleText from '../TitleText';
import Colors from '../../constants/colors';
import MainButton from '../MainButton';

const GameOverScreen = props => {
	return (
		<View style={styles.screen}>
			<TitleText>Game Over!</TitleText>
			<View style={styles.imageContainer}>
				<Image 
					// for loading local images only
					// specifying width and height on local images is optional
					// source={require('../../assets/success.png')} 

					// for loading network images only
					// network images cannot have their size evaluated by react,
					// must always set width and height of network loaded images.
					source={{ uri: 'https://i.ytimg.com/vi/XplrxSSrja0/maxresdefault.jpg'}}

					// fadeDuration can customize the default react behavior
					// of fading an image in after it has been loaded
					// if the app has loaded the image before, it becomes cached and is then
					// treated as a local image, so fadeDuration doesnt apply on 2nd+ loads
					fadeDuration={800}
					style={styles.image} 
					resizeMode="cover" />
			</View>
			<View style={styles.summaryContainer}>
				<BodyText style={styles.summaryText}>Your phone needed
					<Text
						// Text components that are nested in other Text components will
						// inherit the style properties of that parent Text component
						style={styles.highlight}> {props.roundsNumber}</Text> rounds to guess the number <Text>{props.userNumber}</Text>.
				</BodyText>
			</View>
			<MainButton onPress={props.onRestart}>New Game</MainButton>
		</View>
	);
}

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	image: {
		width: '100%',
		height: '100%'
	},
	imageContainer: {
		width: 300,
		height: 300,
		borderRadius: 150,
		borderWidth: 3,
		borderColor: 'black',
		overflow: 'hidden',
		marginVertical: 30
	},
	highlight: {
		color: Colors.primary,
		fontFamily: 'open-sans-bold'
	},
	summaryContainer: {
		marginHorizontal: 30
	},
	summaryText: {
		textAlign: 'center',
		fontSize: 20
	}
});

export default GameOverScreen;