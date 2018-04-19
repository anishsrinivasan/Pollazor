import { Component, OnInit,AfterViewInit, AnimationStyleMetadata } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router,ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase/app';
declare var $:any;
let userId
let prevuserId;
let prevuserId1;
let authId;
let profileId;
let  editprofileimagefile:any;
let  editprofileimageUrl:any;
let editprofileheaderfile:any;
let editprofileheaderUrl:any;
interface Posts {
  title: string;
  content: string;
}
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})


export class ProfileComponent implements OnInit {  
  profileId:any;
  usersCol:any;
  users:any;
  postsCol:any;
  posts:any;
  checkuservote:any;
  editprofileval:boolean=false;
  currentuserid:any;
  previewprofileimage:any;
  previewheaderimage:any;
  about:any;
  displayName:any;
  userpostscount:any;
postsuservotecount=0;
uservotecount=0;
headerimageurl:any;
displayimageurl:any;

  constructor(private route: ActivatedRoute,private afs: AngularFirestore,private afAuth: AngularFireAuth,private router: Router) {

    this.afAuth.authState.subscribe(user => {
      if(user) {authId = user.uid
      this.currentuserid = authId
      console.log("2. Get Auth Id "+authId)
      var refreshuser = this.refreshuser(authId,this.profileId) 
      }
      else{
        var refreshuser = this.refreshuserprofile(this.profileId) 
      }
      
    })
    this.route.params.subscribe(param => {
      this.profileId = param["userid"];
      console.log("1. Get Profile Id "+this.profileId)
      })
  
  }

  ngOnInit() {    
  }

 profileImageChange(files) {

  $("#updatebtn").hide()
    $('#textoverlayprofile').html("Uploading");
    editprofileimagefile =files[0];
    this.previewprofileimage = document.getElementById('previewprofileimage');
    this.previewprofileimage.src = URL.createObjectURL(editprofileimagefile);
    var filename = editprofileimagefile.name;
    var storageRef = firebase.storage().ref('/users/images'+authId+'-displayPic-'+filename+new Date().getTime());
    var uploadTask = storageRef.put(editprofileimagefile);
  
  uploadTask.on('state_changed', function(snapshot){
  // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    
  
  }, function(error) {
    // Handle unsuccessful uploads
  }, function() {
    // Handle successful uploads on complete
    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    var downloadURL = uploadTask.snapshot.downloadURL;
    editprofileimageUrl= downloadURL;
    console.log("File Upload Succefully",downloadURL);
    $('#textoverlayprofile').html("Uploaded");
    $("#updatebtn").show()
  })
}
headerImageChange(files) {
  $('#textoverlayheader').html("Uploading");
  $("#updatebtn").hide()
  editprofileheaderfile =files[0];
  this.previewheaderimage = document.getElementById('previewheaderimage');
  this.previewheaderimage.src = URL.createObjectURL(editprofileheaderfile);
  console.log(this.previewheaderimage)
  var filename = editprofileheaderfile.name;
  var storageRef = firebase.storage().ref('/users/images/cover'+authId+'-cover-'+filename+new Date().getTime());
  var uploadTask = storageRef.put(editprofileheaderfile);

uploadTask.on('state_changed', function(snapshot){
// Observe state change events such as progress, pause, and resume
  // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
  

}, function(error) {
  // Handle unsuccessful uploads
}, function() {
  // Handle successful uploads on complete
  // For instance, get the download URL: https://firebasestorage.googleapis.com/...
  var downloadURL = uploadTask.snapshot.downloadURL;
  editprofileheaderUrl = downloadURL;
  console.log("File Upload Succefully headerImage",editprofileheaderUrl);
  $('#textoverlayheader').html("Uploaded");
  $("#updatebtn").show()
})
}

  ngAfterViewInit(){
    
  }

  editproimage(){
      $('#editprofileimage').click();
  }

  editprofileheader(){
    $('#editprofileheader').click();
}

  updateUserProfile( displayName,about){

    if(!editprofileheaderUrl){
      editprofileheaderUrl = ""
    }
    if(!editprofileimageUrl){
      editprofileimageUrl = ""
    }
    this.afs.collection('users').doc(authId).update({ 'displayName': displayName, 'about':about, 'photoURL':   editprofileimageUrl, 'headerURL':   editprofileheaderUrl, 'timestamp': new Date()})
  }

  refreshuser(authId,profileId){
    console.log("3. Refresh Profile "+profileId + " Auth ID " +authId )
    var checkUser = this.checkUser(authId,profileId)
    this.usersCol = this.afs.collection("users", ref => ref.where("uid","==",profileId));
    this.users = this.usersCol.valueChanges();
    this.postsCol = this.afs.collection("posts", ref => ref.where("uid","==",profileId));
    this.posts = this.postsCol.snapshotChanges()
    .map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Posts;
        const id = a.payload.doc.id;
        return { id, data };
      });
    });
   this.afs.collection('posts').ref.where("uid","==",profileId)
    .get()
    .then(querySnapshot => {
       const postscount = querySnapshot.size
       querySnapshot.forEach(doc => {
       this.postsuservotecount =  this.postsuservotecount + doc.data().voteCount
    });
       this.userpostscount = postscount
       return this.userpostscount
    })
    this.afs.collection('users').ref.where("uid","==",profileId).get().then(querySnapshot =>{
      querySnapshot.forEach(doc => {
        this.displayName = doc.data().displayName;
        this.about = doc.data().about;
        editprofileimageUrl = doc.data().photoURL
        editprofileheaderUrl =doc.data().headerURL
     });
    })
  }

  refreshuserprofile(profileId){
    console.log("3. Refresh Profile "+profileId )
    this.usersCol = this.afs.collection("users", ref => ref.where("uid","==",profileId));
    this.users = this.usersCol.valueChanges();
    this.postsCol = this.afs.collection("posts", ref => ref.where("uid","==",profileId));
    this.posts = this.postsCol.snapshotChanges()
    .map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Posts;
        const id = a.payload.doc.id;
        return { id, data };
      });
    });
   this.afs.collection('posts').ref.where("uid","==",profileId)
    .get()
    .then(querySnapshot => {
       const postscount = querySnapshot.size
       querySnapshot.forEach(doc => {
       this.postsuservotecount =  this.postsuservotecount + doc.data().voteCount
    });
       this.userpostscount = postscount
       return this.userpostscount
    })
    this.afs.collection('users').ref.where("uid","==",profileId).get().then(querySnapshot =>{
      querySnapshot.forEach(doc => {
        this.displayName = doc.data().displayName;
        this.about = doc.data().about;
        editprofileimageUrl = doc.data().photoURL
        editprofileheaderUrl =doc.data().headerURL
     });
    })
  }

  checkUser(authId,profileId){ 
    this.afs.collection("uservotes").ref.where("votevalue","==",profileId) .get()
    .then(querySnapshot => {
       const uservotecount = querySnapshot.size
       this.uservotecount = uservotecount
       console.log(this.uservotecount)
       return this.uservotecount
    })
    const checkvoteRef = this.afs.collection("uservotes").doc(authId)
    this.checkuservote = checkvoteRef.valueChanges();
    return this.checkuservote.subscribe(data => {
      console.log(data)
     if(data != null){
      prevuserId = data.votevalue;
      console.log("Prev User Vote "+prevuserId)
      return true;
     }else{
       console.log("Prev Vote doesn't exists");
       return false
     }
    })
  }

addUserVote(profileId){
  const userVotes = this.afs.collection("uservotes");
  if(!authId){
    alert("Please Login to Vote");
    this.router.navigate(['/userprofile']);
}else{
  userVotes.doc(authId).set({"userid":authId,"votevalue":profileId})
  this.checkUser(authId,profileId)
}
}

editprofiletoggle(){
  if(this.editprofileval == true){
  this.editprofileval = false;
  }
  else
  this.editprofileval = true;
  }

  checkUserVote(){
    if(this.profileId== authId){
  return false;
    }else if(this.profileId == prevuserId){
      return false;
    }else {
      return true;
    }
  }

  deletePost(postid){
    var deletepost = confirm("Delete this Post");
    if(deletepost){
   this.afs.collection("posts").doc(postid).delete();
    }
  }  
}

