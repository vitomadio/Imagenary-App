const functions = require('firebase-functions');
const admin = require("firebase-admin");
const cors = require('cors')({origin: true});
const fs = require('fs');
const UUID = require('uuid-v4');

const gcconfig = {
	projectId: "instalike-1de92",
	keyFilename: "instalike.json"
};

const gcs = require("@google-cloud/storage")(gcconfig);

admin.initializeApp({
  credential: admin.credential.cert(require("./instalike.json")),
  databaseURL: "https://instalike-1de92.firebaseio.com"
});


//Store images in storage...
exports.storeImage = functions.https.onRequest((request, response) => {
	cors(request, response, () => {
		const body = JSON.parse(request.body);
		fs.writeFileSync("/tmp/uploaded-image.jpg", body.image, "base64", err => {
			console.log(err);
			return response.status(500).json({error: err});
		});
		const bucket = gcs.bucket("instalike-1de92.appspot.com");
		const uuid = UUID();

		bucket.upload("/tmp/uploaded-image.jpg", {
			uploadType:"media",
			destination: "/posts/" + uuid + ".jpg",
			metadata: {
				metadata: {
					contentType: "image/jpeg",
					firebaseStorageDownloadTokens: uuid
				}
			}
		}, 
		(err, file) => {
			if (!err) {
				response.status(201).json({
					imageUrl: "https://firebasestorage.googleapis.com/v0/b/"+bucket.name+"/o/"+encodeURIComponent(file.name)+"?alt=media&token="+uuid,
					imagePath: "/posts/"+uuid+".jpg"
				});
			} else {
				console.log(err);
				response.status(500).json({error: err});
			}
		});
	});
});


//Delete Post image
exports.deleteImage = functions.database
.ref("/posts/{postId}")
.onDelete(event => {
	console.log(event._data.imagePath);
const imagePath = event._data.imagePath;

const bucket = gcs.bucket("instalike-1de92.appspot.com");
return bucket.file(imagePath).delete();
});

//Upload Avatar image...
exports.storeAvatar = functions.https.onRequest((request, response) => {
	cors(request, response, () => {
		const body = JSON.parse(request.body);
		fs.writeFileSync("/tmp/uploaded-image.jpg", body.image, "base64", err => {
			console.log(err);
			return response.status(500).json({error: err});
		});
		const bucket = gcs.bucket("instalike-1de92.appspot.com");
		const uuid = UUID();

		bucket.upload("/tmp/uploaded-image.jpg", {
			uploadType:"media",
			destination: "/posts/" + uuid + ".jpg",
			metadata: {
				metadata: {
					contentType: "image/jpeg",
					firebaseStorageDownloadTokens: uuid
				}
			}
		}, 
		(err, file) => {
			if (!err) {
				response.status(201).json({
					imageUrl: "https://firebasestorage.googleapis.com/v0/b/"+bucket.name+"/o/"+encodeURIComponent(file.name)+"?alt=media&token="+uuid,
					imagePath: "/posts/"+uuid+".jpg"
				});
				bucket.file(body.imagePath).delete();
			} else {
				console.log(err);
				response.status(500).json({error: err});
			}
		});
	});
});

//Sends notification to user when gets follow request.
exports.sendFollowerNotification = functions.database.ref('/users/{invitedUid}/requests/{inviterUid}')
.onWrite((change, context) => {
	const invitedUid = context.params.invitedUid;
	const inviterUid = context.params.inviterUid;
	//Check if inviter change his mind and unfollow user...
	if(!change.after.val()){
		return console.log('User '+inviterUid+' un-followed user '+invitedUid);
	}
	console.log('User '+inviterUid+' wants to follow user '+invitedUid)

	//Get the lisdt of device notification tokens...
	const getDeviceTokensPromise = admin.database()
		.ref(`/users/${invitedUid}/notificationsToken`).once('value');

	//Get the inviter profile...
	const getInviterProfilePromise = admin.auth().getUser(inviterUid);

	//Declare variable for invided tokens...
	let tokensSnapshot;

	//Declare variable containing all invited tokens...
	let tokens;

	return Promise.all([getDeviceTokensPromise, getInviterProfilePromise]).then(results => {
		tokensSnapshot = results[0];
		const inviter = results[1];

		//Check for device tokens existance...
		if(!tokensSnapshot.hasChildren()){
			return console.log('ther is no notification tokens to send to');
		}
		console.log('There are', tokensSnapshot.numChildren(), 'tokens to send notifications to.');
		console.log('Fetched inviter profile', inviter);

		//Notification details.
		const payload = {
			notification: {
				title: 'You have a new invitation',
				body: `${inviter.displayName} wants to follow you.`
			}
		};

		//Listing all tokens as an array.
		tokens = Object.keys(tokensSnapshot.val());
		//Send Notification to all tokens.
		return admin.messaging().sendToDevice(tokens, payload); 
	})
	.then((response) => {
		// For each message check if there was an error.
		const tokensToRemove = [];
		response.results.forEach((result, index) => {
			const error = result.error;
			if(error) {
				console.error('Failure sending notification to', tokens[index], error);
				//Cleanup the tokens who are not registered anymore.
				if(error.code === 'messaging/invalid-registration-token' ||
					error.code ==='messaging/registration-token-not-registerd') {
					tokensToRemove.push(tokensSnapshot.ref.child(tokens[index]).remove());
				}
			}
		});
		return Promise.all(tokensToRemove);
	})
});

//Sends notification to user when gets chat message request.
exports.sendChatNotification = functions.database.ref('/users/{sessionUserKey}/chats/{chatKey}')
.onWrite((change, context) => {
	const sessionUserKey =  context.params.sessionUserKey;
	const data =  change.after.val();
	//Get the list of device notification token only if serder is different to recipient to avoid conflict.
	if(sessionUserKey !== data.recipient){
		const getDeviceTokensPromise = admin.database()
			.ref(`/users/${data.recipient}/notificationsToken`).once('value');
			//Get the recipient profile...
			const getSenderPromise = admin.auth().getUser(sessionUserKey);
		
			//Declare variable for invided tokens...
			let tokensSnapshot;
			//Declare variable containing all invited tokens...
			let tokens;
		
			return Promise.all([getDeviceTokensPromise, getSenderPromise])
			.then(results => {
				tokensSnapshot = results[0];
				const sender = results[1];
		
				//Check for device tokens existance...
				if(!tokensSnapshot.hasChildren()){
					return console.log('ther is no notification tokens to send to');
				}
				console.log('There are', tokensSnapshot.numChildren(), 
				'tokens to send notifications to.');
				console.log('Fetched sender profile', sender);
		
				//Notification details.
				const payload = {
					notification: {
						title: `You have a new message from ${sender.email}`,
						body: data.message.slice(0,20)+'...',
						sound: 'default',
						// click-action: Action here
					}
				};
		
				//Listing all tokens as an array.
				tokens = Object.keys(tokensSnapshot.val());
				//Send Notification to all tokens.
				return admin.messaging().sendToDevice(tokens, payload); 
			})
			.then((response) => {
				// For each message check if there was an error.
				const tokensToRemove = [];
				response.results.forEach((result, index) => {
					const error = result.error;
					if(error) {
						console.error('Failure sending notification to', tokens[index], error);
						//Cleanup the tokens who are not registered anymore.
						if(error.code === 'messaging/invalid-registration-token' ||
							error.code ==='messaging/registration-token-not-registerd') {
							tokensToRemove.push(tokensSnapshot.ref.child(tokens[index]).remove());
						}
					}
				});
				return Promise.all(tokensToRemove);
			})
	}else{
		console.log('Nothing is supposed to happen.');
	}

});






