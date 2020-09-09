import React, { useState } from 'react';
import './App.css';
// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig)
function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    phone: ''
  })
  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () =>{
    firebase.auth().signInWithPopup(provider)
    .then(response => {
      const {displayName, photoURL, email} = response.user;
      const signedInUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL
      }
      setUser(signedInUser);

      console.log(displayName, email, photoURL);
    })
    .catch(error => {
      console.log(error);
      console.log(error.message);
    })
  }
  const handleSignOut = () => {
    firebase.auth().signOut()
    .then(response => {
      const signedOutUser = {
        isSignedIn: false,
        name: '',
        photo: '',
        email: ''
      }
      setUser(signedOutUser);
    })
    .catch(err => {

    })
  }
  return (
    <div className="App">
     {
       user.isSignedIn ?  <button onClick={handleSignOut}> Sign out</button> :
      <button onClick={handleSignIn}> Sign in</button>}
     {
       user.isSignedIn && <div>
       <p>Welcome, {user.name}!</p>
       <p>your email: {user.email}</p>
        <img src={user.photo} alt=''></img>
       </div>
     }
    </div>
  );
}

export default App;
