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
  const [newUser, setNewUser] = useState(false)
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    phone: ''
  })
  const provider = new firebase.auth.GoogleAuthProvider();
  const fbProvider = new firebase.auth.FacebookAuthProvider();

  const handleSignIn = () =>{
    firebase.auth().signInWithPopup(provider)
    .then(response => {
      const {displayName, photoURL, email} = response.user;
      const signedInUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL
      };
      setUser(signedInUser);
    })
    .catch(error => {
      console.log(error);
      console.log(error.message);
    })
  }

  const handleFBLogin = () => {
    firebase.auth().signInWithPopup(fbProvider).then(function(result) {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // ...
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
  }


  const handleSignOut = () => {
    firebase.auth().signOut()
    .then(response => {
      const signedOutUser = {
        isSignedIn: false,
        name: '',
        photo: '',
        email: '',
        error: '',
        success: false
      }
      setUser(signedOutUser);
    })
    .catch(err => {
        
    });
  }

  const handleBlur = (event) => {
    let isFieldValid = true;
    if(event.target.name === 'email'){
      isFieldValid = /\S+@\S+\.\S+/.test(event.target.value);
      
  }
  if(event.target.name === 'password'){
    const isPasswordValid = event.target.value.length>6;
    const passwordHasValue = /\d{1}/.test(event.target.value);
    isFieldValid = (isPasswordValid && passwordHasValue);
  }
  if(isFieldValid){
    const newUserInfo = {...user};
    newUserInfo[event.target.name] = event.target.value;
    setUser(newUserInfo);
  }
}
  const handleSubmit = (event) => {
    if (newUser && user.email && user.password) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(response =>{
        const newUserInfo = {...user};
        newUserInfo.error = '';
        newUserInfo.success = true;
        setUser(newUserInfo);
        updateUserName(user.name);

      })
      .catch(error => {
        const newUserInfo = {...user};
        newUserInfo.error = error.message;
        newUserInfo.success = false;
        setUser(newUserInfo);
      });
      
    }
    if (!newUser && user.email && user.password) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(response => {
        const newUserInfo = {...user};
        newUserInfo.error = '';
        newUserInfo.success = true;
        setUser(newUserInfo);
        console.log('sign in user info', response.user)

      })
      .catch(function(error) {
        // Handle Errors here.
        const newUserInfo = {...user};
        newUserInfo.error = error.message;
        newUserInfo.success = false;
        setUser(newUserInfo);
      });
      
    }
    event.preventDefault();
  }
  const updateUserName = name =>{

      const user = firebase.auth().currentUser;

      user.updateProfile({
        displayName: name
        
      }).then(function() {
        console.log('user name updated successfully')
      }).catch(function(error) {
        console.log(error)
      });
  }

  return (
    <div className="App">
     {
       user.isSignedIn ?  <button onClick={handleSignOut}> Sign out</button> :
      <button onClick={handleSignIn}> Sign in</button>
    }
    <br/>
    <button onClick={handleFBLogin}>Login with facebook</button>
     {
       user.isSignedIn && <div>
       <p>Welcome, {user.name}!</p>
       <p>your email: {user.email}</p>
        <img src={user.photo} alt=''></img>
       </div>
     }
     <h1>Own Authentication</h1>
     <input type="checkbox" onChange={()=> setNewUser(!newUser)} name="newUser" id=""/>
     <label htmlFor="newUser">New user sign up</label>

     <form onSubmit={handleSubmit}>
    {newUser && <input type="name" name="name" onBlur={handleBlur} placeholder="enter your name" required/>}
      <br/>
      <input type="email" name='email' onBlur={handleBlur} placeholder="enter your email" required/>
      <br/>
      <input type="password" name="password" onBlur={handleBlur} placeholder="Enter your password" required/>
      <br/>
      <input type="submit" value={newUser ? 'Sign up' : "Sign In"}/>
     </form>
     
     <p style={{color: 'red'}}>{user.error}</p>
     {
       user.success && <p style={{color: 'green'}}>user {newUser ?'crerated' : 'logged in'} Successfully{user.error}</p>
     }

    </div>
  );
    }

export default App;
