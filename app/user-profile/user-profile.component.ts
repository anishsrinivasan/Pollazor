import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
 

declare var $:any;
let selectedFile:any;
let imageUrl:any;
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  
 
})
export class UserProfileComponent implements OnInit {
  email: string;
  password: string;
  displayName:string;
  dateofbirth:string;
  gender:string
  signtoggleval:boolean = true;
  userId:any;
  constructor(public auth: AuthService,private afAuth: AngularFireAuth) { 
    this.afAuth.authState.subscribe(user => {
      if(user) this.userId = user.uid
      console.log("This user Id is "+this.userId);
      
    })
  }

ngOnInit(){
  $("#updatebtn").hide()
  $("#file").on("click",function(event){
    selectedFile = event.target.files[0];
   $('#loginbtn').show();
     });
}

  fileChange(files) {
      selectedFile =files[0];
  }

  signin(): void {
    this.auth.emailLogin(this.email,this.password)
  }

  signup(): void {
    this.auth.emailSignUp(this.email,this.password,this.displayName)
  }
  
signtoggle(){
if(this.signtoggleval == true){
this.signtoggleval = false;
}
else
this.signtoggleval = true;
}

updateUserInfo()
 {
this.auth.updateUserInfo(this.displayName,this.dateofbirth,this.gender,imageUrl,this.userId);
 }
 uploadFile(){
 
  var filename = selectedFile.name;
  var storageRef = firebase.storage().ref('/users/images'+this.userId+'-displayPic-'+filename);
  var uploadTask = storageRef.put(selectedFile);

  // Register three observers:
// 1. 'state_changed' observer, called any time the state changes
// 2. Error observer, called on failure
// 3. Completion observer, called on successful completion
uploadTask.on('state_changed', function(snapshot){
// Observe state change events such as progress, pause, and resume
  // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
  

}, function(error) {
  // Handle unsuccessful uploads
}, function() {
  // Handle successful uploads on complete
  // For instance, get the download URL: https://firebasestorage.googleapis.com/...
  var downloadURL = uploadTask.snapshot.downloadURL;
  imageUrl = downloadURL;
  console.log("File Upload Succefully",downloadURL);
  $('#uploadbtn').html("Uploaded Succesfully");
  $("#updatebtn").show()
});
}
}