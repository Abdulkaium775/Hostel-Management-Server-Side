import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { auth } from '../Component/firebase.init';
import { AuthContext } from './AuthContext';

const AuthProvider = ({children}) => {

    const googleProvider = new GoogleAuthProvider();
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const createUser = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    //create user by using google
    const createUserWithGoogle = () => {
        setLoading(true)
        return signInWithPopup(auth, googleProvider)
    }
    // login existing user 
    const loginUser = (email, password) => {
        setLoading(true)
        return signInWithEmailAndPassword(auth, email, password)
    }

    // logout
    const logOutUser = () => {
        signOut(auth)
    }
    // update profile 
    const updateUser = (updatedData) => {
        return updateProfile(auth.currentUser, updatedData)
    }
    // reset password
    const resetPassword = (email) => {
        return sendPasswordResetEmail(auth, email)
    }
    // keep it in this website like local storage after reload pages it will not go anywhere
    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser)
            setLoading(false)
        })
        return () => {
            unSubscribe()
        }
    }, [])
    const authData ={
        user,
        setUser,
        createUser,
        loading,
        loginUser,
        logOutUser,
        createUserWithGoogle,
        updateUser,
        resetPassword
    }
    return <AuthContext value={authData}>{children}</AuthContext>
};

export default AuthProvider;