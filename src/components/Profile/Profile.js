import React, { Component } from 'react';
import {
	View,
	Text,
	FlatList,
	ScrollView,
	TouchableOpacity,
	TouchableNativeFeedback,
	StyleSheet,
	ImageBackground,
	Image,
	Platform,
	ActivityIndicator
} from 'react-native';
import Avatar from '../UI/Avatar';
import Icon from 'react-native-vector-icons/Ionicons';

class Profile extends Component {
	constructor(props) {
		super(props)

		this.state = {
			selectedPosts: []
		}
	}

	render() {

		const { selectedPosts } = this.props;
		let icon = (
			<Icon
				name={Platform.OS === "ios" ? "ios-add-circle-outline" : "md-add-circle-outline"}
				size={25}
				color="#48C9B0"
			/>
		)

		if (this.props.isLoading) {
			icon = <ActivityIndicator />
		}

		return (
			<View style={styles.container}>
				{selectedPosts.length >= 1 &&
					<View style={styles.editBar}>
						<Text style={{ color: '#eee', flex: 6, fontSize: 18 }}>Edit Post</Text>
						<TouchableOpacity style={{ flex: 1 }}>
							<Icon
								name={Platform.OS === "ios" ? "ios-create" : "md-create"}
								size={25}
								color="#eee"
							/>
						</TouchableOpacity>
						<TouchableOpacity
							style={{ flex: 1 }}
							onPress={this.props.deletePost}
						>
							<Icon
								name={Platform.OS === "ios" ? "ios-trash" : "md-trash"}
								size={25}
								color="#eee"
							/>
						</TouchableOpacity>
					</View>
				}
				<View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', height: 140, marginTop: 10 }}>
					<View style={styles.profileHeading}>
						{Platform.OS === "ios" ?
							<TouchableOpacity
								onPress={this.props.onChangeAvatar}
								style={styles.changePictureIcon}
							>
								{icon}
							</TouchableOpacity>
							:
							<View style={[styles.changePictureIcon, { left: 67 }]}>
								<TouchableNativeFeedback
									onPress={this.props.onChangeAvatar}
									background={TouchableNativeFeedback.SelectableBackground()}
								>
									{icon}
								</TouchableNativeFeedback>
							</View>
						}
						<Avatar
							style={styles.avatar}
							source={{ uri: this.props.user.avatar }}
						/>
						<Text style={{ marginTop: 10 }}>{this.props.user.username}</Text>
					</View>
					{this.props.button || null}
				</View>
				<View style={styles.profileStatsBody}>
					<View style={styles.profileStats}>
						<Text>{this.props.posts.length}</Text>
						<Text style={{ color: '#aaa' }}>Post</Text>
					</View>
					<View style={styles.profileStats}>
						<Text>{this.props.followers.length}</Text>
						<Text style={{ color: '#aaa' }}>Followers</Text>
					</View>
					<View style={styles.profileStats}>
						<Text>{this.props.following.length}</Text>
						<Text style={{ color: '#aaa' }}>Following</Text>
					</View>
				</View>
				<ScrollView
					contentContainerStyle={{ flexDirection: 'row', width: '100%', justifyContent: 'center', padding: 10 }}
				>
					<FlatList
						data={this.props.posts}
						extraData={selectedPosts}
						numColumns={3}
						initialNumToRender={3}
						renderItem={({ item, i }) => (
							<TouchableOpacity
								onPress={selectedPosts.length >= 1 ?
									this.props.onPressImage(item) :
									this.props.onPress(item)}
								onLongPress={this.props.onLongPress(item)}
							>
								<Image
									style={{ height: 110, width: 110, margin: 1 }}
									source={{uri: item.image}}
								/>
								{selectedPosts.filter(post => post.key === item.key).length >= 1 ?
									<ImageBackground style={styles.selectIcon}>
										<Icon
											style={{ position: 'absolute', left: 2, zIndex: 999 }}
											name={Platform.OS === "ios" ? "ios-checkmark" : "md-checkmark"}
											size={20}
											color="#fff"
										/>
									</ImageBackground>
									: null}
							</TouchableOpacity>
						)}
						keyExtractor={item => item.key}
					/>
				</ScrollView>
			</View>
		);
	}
}


const styles = StyleSheet.create({
	container: {
		flexDirection: 'column',
		width: '100%',
		height: '100%',
		alignItems: 'center'
	},
	editBar: {
		width: '100%',
		height: 60,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
		backgroundColor: '#48C9B0',
		paddingRight: 16,
		paddingLeft: 16
	},
	profileHeading: {
		flexDirection: 'column',
		alignItems: 'center',
		marginTop: 10,
		marginBottom: 20
	},
	profileStatsBody: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		alignItems: 'flex-start',
		height: 60
	},
	profileStats: {
		flexDirection: 'column',
		alignItems: 'center',
		width: 90, height: '100%',
		justifyContent: 'space-evenly'
	},
	avatar: {
		width: 80,
		height: 80,
		borderRadius: 40,
		zIndex: -1
	},
	changePictureIcon: {
		position: 'absolute',
		top: 62,
		left: 62,
		zIndex: 999
	},
	selectIcon: {
		height: 20,
		width: 20,
		backgroundColor: '#48C9B0',
		borderWidth: 1,
		borderColor: '#fff',
		position: 'absolute',
		top: 4,
		right: 4,
		zIndex: 998,
	}
});

export default Profile;