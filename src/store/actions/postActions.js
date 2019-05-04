import {
  SET_POSTS,
  SET_POST,
  SET_POST_COMMENTS,
  ADDED_NEW_POST,
  ON_POST_DELETED,
  ON_MY_POST_SET,
  ON_GET_MY_POSTS_COMMENTS,
  REMOVE_FOLLOWED_LIKE,
  REMOVE_POSTS_COMMENTS,
} from './actionsTypes';
import Firebase from 'firebase';
import firebase from 'react-native-firebase'

const db = firebase.database();

//Add new post to collection
export const addPost = (image, userId) => {
  return dispatch => {
    fetch("https://us-central1-instalike-1de92.cloudfunctions.net/storeImage", {
      method: "POST",
      body: JSON.stringify({
        image: image.base64
      })
    })
      .catch(err => console.log(err))
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error();
        }
      })
      .then(parsedRes => {
        const postData = {
          userId: userId,
          image: parsedRes.imageUrl,
          imagePath: parsedRes.imagePath
        };
        fetch("https://instalike-1de92.firebaseio.com/posts.json", {
          method: "POST",
          body: JSON.stringify(postData)
        }
        )
          .catch(err => console.log(err))
          .then(res => res.json())

      });
  }
};
//Add new post to store
export const addPostToPosts = (post) => {
  return {
    type: ADDED_NEW_POST,
    payload: post
  }
}
//Fetch posts
export const getPosts = () => {
  return dispatch => {
    db.ref('/posts/').limitToLast(100).on('value', (snapshot) => {
      let posts = [];
      snapshot.forEach(post => {
        posts.unshift({
          image: {
            uri: post.val().image
          },
          key: post.key,
          userId: post.val().userId,
          likes: post.val().likes ? Object.values(post.val().likes) : [],
          comments: post.val().comments ? Object.values(post.val().comments) : []
        });
      });
      dispatch(setPosts(posts));
    });
  };
};
//Set posts in store
export const setPosts = posts => {
  return {
    type: SET_POSTS,
    posts: posts
  };
};
//Get session user posts.
export const getMyPosts = sessionUser => {
  return dispatch => {
    db.ref('/posts/').on('value', snapshot => {
      const myPosts = [];
      snapshot.forEach(post => {
        if (post.val().userId === sessionUser.key) {
          myPosts.push({ ...post.val(), key: post.key });
        }
      })
      dispatch(setMyPosts(myPosts))
    });
  };
};
//Set my post in store.
const setMyPosts = posts => {
  return {
    type: ON_MY_POST_SET,
    payload: posts
  }
}
//Get all comments of my posts.
export const getMyPostsComments = (posts, sessionUserKey) => {
  return dispatch => {
    // const myPostsComments = [];
    posts.forEach(postKey => {
      db.ref('/users/' + sessionUserKey + '/comments/' + postKey).on('value', snapshot => {
        snapshot.forEach(item => {
          dispatch(setMyPostsComments({ ...item.val(), commentKey: item.key, postId: postKey }));
        })
      });
    })
  };
};
//Set all comments to store.
const setMyPostsComments = postsComments => {
  return {
    type: ON_GET_MY_POSTS_COMMENTS,
    payload: postsComments
  }
}
//Get my posts likes.
//Get a specific post.
export const getPost = postId => {
  return dispatch => {
    db.ref('/posts/' + postId).once('value')
      .then((snapshot) => {
        const post = {
          image: snapshot.val().image,
          key: postId,
          userId: snapshot.val().userId,
          likes: snapshot.val().likes ? Object.values(snapshot.val().likes) : [],
          comments: snapshot.val().comments ? Object.values(snapshot.val().comments) : []
        };

        dispatch(setPost(post));
      });
  };
};
//Set post in store
export const setPost = post => {
  return {
    type: SET_POST,
    post: post
  };
};
//Get all comments of a post.
export const getPostComments = postId => {
  return dispatch => {
    db.ref('/posts/' + postId + '/comments').on('value', (snapshot) => {
      const comments = [];
      if (snapshot.val()) {
        snapshot.forEach(item => {
          db.ref('/users/' + item.val().author).once('value')
            .then(res => {

              const comment = {
                author: { ...res.val(), key: res.key },
                message: item.val().comment,
                key: item.key,
                date: item.val().date ? item.val().date : null
              }
              comments.unshift(comment);
              return comments;
            })
            .then(response => dispatch(setPostComments(response)))
            .catch(err => console.log(err));
        });
      }
    });
  };
};
//Set post comments to store.
export const setPostComments = comments => {
  return {
    type: SET_POST_COMMENTS,
    comments: comments
  };
};
//Add or remove like to post
export const onPostLike = (post, sessionUserId, index, mode) => {
  return dispatch => {
    const postRef = db.ref('/posts/' + post.key + '/likes/' + sessionUserId);
    const userRef = db.ref('/users/' + sessionUserId + '/likes/' + post.key);
    const postAuthorRef = db.ref('/users/' + post.userId + '/myPostsLikes/' + sessionUserId).child(post.key);
    if (mode === "like") {
      postRef.set({ userId: sessionUserId });
      userRef.set({
        post: post.key,
        date: Firebase.database.ServerValue.TIMESTAMP
      });
      postAuthorRef.set({
        key: postAuthorRef,
        post: post.key,
        author: sessionUserId,
        date: Firebase.database.ServerValue.TIMESTAMP
      })
    } else {
      postRef.remove();
      userRef.remove();
      postAuthorRef.remove();
    }
  };
};
//Add comment to post
export const addComment = (comment, sessionUser, post) => {
  return dispatch => {
    const newPostRef = db.ref('/posts/' + post.key + '/comments/').push().key;
    db.ref('/posts/' + post.key + '/comments/' + newPostRef).set({
      key: newPostRef,
      comment: comment,
      author: sessionUser.key,
      date: Firebase.database.ServerValue.TIMESTAMP
    });
    db.ref('/users/' + post.userId + '/comments/' + post.key).child(newPostRef).set({
      comment: comment,
      author: sessionUser.key,
      seen: false,
      postId: post.key,
      date: Firebase.database.ServerValue.TIMESTAMP,
      key: newPostRef
    });
    db.ref('/users/' + sessionUser.key + '/comments/' + post.key).child(newPostRef).set({
      comment: comment,
      author: sessionUser.key,
      postId: post.key,
      date: Firebase.database.ServerValue.TIMESTAMP,
      key: newPostRef
    });
  };
};
//Open list of comment screen
export const openComment = (sessionUser) => {
  return dispatch => {
    const dbRef = db.ref('/users/' + sessionUser.key + '/comments/').once('value')
    dbRef
      .then(snapshot => {
        snapshot.forEach(item => {
          item.forEach(comment => {
            if (comment.val().seen === false) {
              console.log('executed');
              db.ref('/users/' + sessionUser.key + '/comments/' + item.key + '/' + comment.key).update({
                seen: true
              })
            }
          })
        })
      })
  };
};
//Delete Post.
export const deletePost = (posts) => {
  return dispatch => {
    posts.forEach(post => {
      //Remove post.
      db.ref('/posts/' + post.key).remove();
      //Remove comments from post author.
      db.ref('/users/' + post.userId + '/comments/' + post.key).remove();
      //Remove post likes from post author.
      db.ref('/users/' + post.userId + '/likes/' + post.key).remove();
      //Remove likes and comments from followed users.
      db.ref('/users/' + post.userId + '/follow/').once('value', snapshot => {
        snapshot.forEach(item => {
          db.ref('/users/' + item.key + '/likes/' + post.key).remove();
          db.ref('/users/' + item.key + '/comments/' + post.key).remove();
        })
      })
      dispatch(removePostFromStore(post));
      dispatch(removeFollowedLikeFromStore(post));
      dispatch(removeCommentFromStore(post));
      dispatch(removeFollowedLikeFromStore(post))
    });
  };
};
//Remove post from store.
const removePostFromStore = post => {
  return {
    type: ON_POST_DELETED,
    payload: post
  };
};
//Remove post like from followedLikes in store.
const removeFollowedLikeFromStore = post => {
  return {
    type: REMOVE_FOLLOWED_LIKE,
    payload: post
  }
}
//Remove comment from myPostsComments in store after post delet.
const removeCommentFromStore = post => {
  return {
    type: REMOVE_POSTS_COMMENTS,
    payload: post
  }
}











