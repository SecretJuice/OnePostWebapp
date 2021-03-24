const auth = firebase.auth();
const db = firebase.firestore();

const whenSignedIn = document.getElementById('whenSignedIn');
const whenSignedOut = document.getElementById('whenSignedOut');

const signInButton = document.getElementById('signInButton');
const signOutButton = document.getElementById('signOutButton');

const userDetails = document.getElementById('userDetails');

const postInput = document.getElementById('postInput');
const postButton = document.getElementById('postButton');

const postList = document.getElementById('postList');

const googleProvider = new firebase.auth.GoogleAuthProvider();

let postCollectionReference = db.collection('posts');
let unsubscribe = postCollectionReference.limit(20).orderBy("timestamp", "desc").onSnapshot(querySnapshot => {

    const posts = querySnapshot.docs.map(doc => {

        return `<li>Post by UID: ${ doc.data().uid } -- Content: ${ doc.data().message }</li>`

    });

    postList.innerHTML = posts.join('');

});

signInButton.onclick = () => auth.signInWithPopup(googleProvider);

signOutButton.onclick = () => auth.signOut();



function createPost(user){

    let postMessage = postInput.value;

    console.log(postMessage);

    if (postMessage != ""){

        postCollectionReference.add({
            uid: user.uid,
            message: postMessage,
            likes: 0,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()

        })

        postInput.value = "";
    }

}

auth.onAuthStateChanged(user => {

    if (user) {
        whenSignedIn.hidden = false;
        whenSignedOut.hidden = true;
        userDetails.innerHTML = `<h3>Welcome, ${user.displayName}!</h3> <p>User ID: ${user.uid}</p>`;

        postButton.onclick = () => createPost(user);
    }
    else{
        whenSignedIn.hidden = true;
        whenSignedOut.hidden = false;
        userDetails.innerHTML = ``;
    }

});