import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap'

interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  gender?:string;
  dateofbirth?:string;
}
@Injectable()

export class AuthService {
  user: Observable<User>;
  constructor(private afAuth: AngularFireAuth,
              private afs: AngularFirestore,
              private router: Router) {
      //// Get auth data, then get firestore user document || null
      this.user = this.afAuth.authState
        .switchMap(user => {
          if (user) {
            return this.afs.doc<User>(`users/${user.uid}`).valueChanges()
          } else {
            return Observable.of(null)
          }
        })
  }

    // If error, console log and notify user
    private handleError(error: Error) {
      alert(error);
      console.error(error);
    }
  signinwithemail (email,password){
    alert(email+password);
  const provider = this.afAuth.auth.createUserWithEmailAndPassword(email, password)
  return this.oAuthLogin(provider);

}
  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider()
    return this.oAuthLogin(provider).catch((error) => this.handleError(error) );;
  }
  facebookLogin(){
    const provider = new firebase.auth.FacebookAuthProvider()
    return this.oAuthLogin(provider).catch((error) => this.handleError(error) );;
  }
  //// Email/Password Auth ////
  emailSignUp(email: string, password: string,displayName: string) {
    alert(email);
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((user) => {
        return this.updateUserData(user); // if using firestore
      })
      .catch((error) => this.handleError(error) );
  }

  emailLogin(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((user) => {
       
        this.router.navigate(['/userprofile']); // if using firestore
      })
      .catch((error) => this.handleError(error) );
  }

  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        console.log(credential)
        console.log(credential.additionalUserInfo.isNewUser)
        if(credential.additionalUserInfo.isNewUser == true){
          this.updateUserData(credential.user)
          this.router.navigate(['/']);
          console.log("User does not exist")
          
        }
        else{
          this.router.navigate(['/']);
          console.log("User Already Exists")
        }
      })
  }
  private updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
     

    }
    return userRef.update(data) .then(() => {
      // update successful (document exists)
      console.log('User Exists');
    })
    .catch((error) => {
      // console.log('Error updating user', error); // (document does not exists)
      userRef.set(data);
    })
  }




  updateUserInfo(displayName,dateofbirth,gender,userImageUrl,userId){
    console.log("inside"+userImageUrl)
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${userId}`);
    userRef.update({'displayName':displayName,'dateofbirth':dateofbirth,'gender':gender,'photoURL':userImageUrl});
    console.log("Updated");
    this.router.navigate(['/']);
  }

  signOut() {
    this.afAuth.auth.signOut().then(() => {
        this.router.navigate(['/']);
    });
  }
}