import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import "firebase/storage";
declare var $: any;
interface Posts {
  title: string;
  content: string;
}

interface Polls {
  title: string;
  content: string;
  rating: number;
}

interface PostId extends Posts {
  id: string;
}
let postId: string;
let userId: string;
let pollId: string;
let postsRef: any;
let title: any;
let posts1: any;
let selectedFile: any;
let selectedPollFile:any;
let imageUrl: any;
let pollimageUrl: any;
let authorName: any;
let authorImage: any;

posts1 = this.posts;
@Component({
  selector: 'app-createpoll',
  templateUrl: './createpoll.component.html',
  styleUrls: ['./createpoll.component.css']
})


export class CreatepollComponent implements OnInit {
  public postadded = true;
  postsDoc: AngularFirestoreDocument<any>;
  postsCol: AngularFirestoreCollection<any>;
  posts: any;
  pollsCol: AngularFirestoreCollection<any>;
  polls: any;
  polltitle: string;
  pollcontent: string;
  posttitle: string;
  postcontent: string;
  rating: number;
  userId: string;
  postId: string;
  pollId: string;
  previewimage: any;
  name: string;
  previewimageurl:any;
  pollindex=1;
  showSpinner=false;
  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth, private router: Router) {
    this.afAuth.authState.subscribe(user => {
      if (user) this.userId = user.uid
      console.log("This user Id is " + this.userId);
      authorName=user.displayName;
      authorImage = user.photoURL;
    })
  }


  ngOnInit() {
    $(".showSpinner").hide();
    $(".addpoll").hide();
    $('#previewimage').hide();
    $("#uploadpollbtn").hide();
    $("#addpollbtn").show();
    postsRef = this.afs.collection("posts");
    this.posts = postsRef.valueChanges();
  }


  addPostBtn() {
    if(selectedFile){
      this.addPost();
    }else{
      imageUrl=null;
      this.addPost();
    }
  }

  addPost(){
    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    var newdate = new Date().toLocaleDateString("en-US", options)
    const postsRef = this.afs.collection("posts");
    this.afs.collection('posts').add({ 'title': this.posttitle, 'content': this.postcontent, 'uid': this.userId, 'postimage': imageUrl, 'authorname': authorName, 'authorimage': authorImage, 'timestamp': new Date(), 'postdate': newdate,'voteCount':0 }).then(function (docRef) {
      postId = docRef.id;
    }).then(function () {
      if (postId) {
        postsRef.doc(postId).update({ 'postid': postId });
        console.log("Post ID Updated");
      }
      else {
        alert("Not updated");
      }
    })
    this.postadded = false;
    selectedFile=null;
    $(".addpost").hide();
    $(".addpoll").show();
    console.log("Post Added Succesfully");
  }

  deletePost(postId) {
    this.afs.doc('posts/' + postId).delete();
    alert("Post Delted");
  }

  uploadPostImage(files) {
    $(".showSpinner").show();
    $('#addpostbtn').hide();
    selectedFile = files[0];
    this.previewimage = document.getElementById('previewimage');
    this.previewimageurl =  URL.createObjectURL(selectedFile);
    $('#previewimage').show();
    this.previewimage.style.backgroundImage="url("+this.previewimageurl+")";
      var filename = selectedFile.name;
      var storageRef = firebase.storage().ref('/posts/images' +new Date().getTime() + filename);
      var uploadTask = storageRef.put(selectedFile);
      uploadTask.on('state_changed', function (snapshot) {
      }, function (error) {
      }, function () {
        var downloadURL = uploadTask.snapshot.downloadURL;
        imageUrl = downloadURL;
        console.log("File Upload Succefully", downloadURL);
        $('#addpostbtn').show();
        $(".showSpinner").hide();
      });

  }

  uploadPollImage(files) {
    $(".showSpinner").show();
    $("#addpollbtn").hide();
    selectedPollFile = files[0];
    var filename = selectedPollFile.name;
    var storageRef = firebase.storage().ref('/poll/images' +new Date().getTime() + filename);
    var uploadTask = storageRef.put(selectedPollFile);
    uploadTask.on('state_changed', function (snapshot) {

    }, function (error) {

    }, function () {
      var downloadURL = uploadTask.snapshot.downloadURL;
      pollimageUrl = downloadURL;
      console.log("File Upload Succefully", downloadURL);
      $('#uploadpollbtn').html("Uploaded Succesfully");
      $("#addpollbtn").show();
      $(".showSpinner").hide();
    });

  }


addPollBtn(){
  if(selectedPollFile){
    this.addPoll();
  }else{
    pollimageUrl=null;
    this.addPoll();
  }
}

pollcounter(){
  if(this.pollindex >= 2){
    console.log(this.pollindex)
    return true;
  }else{
    return false;
  }
}

  addPoll() {
    this.pollindex=this.pollindex+1;
    $('#uploadpollbtn').html("Upload Image");
    if (postId) {
      this.afs.collection('posts').doc(postId).collection('polls').add({ 'polltitle': this.polltitle, 'pollcontent': this.pollcontent, 'postid': postId, 'votes': 0, 'pollimage': pollimageUrl, 'timestamp': new Date() });
      this.refreshPoll();
      selectedPollFile=null;
      $("#polltitle").val('');
      $("#pollcontent").val('');
      $("#pollfile").val('');
      $("#addpollbtn").show();

    }
    else {
      alert("Enter Post");
      console.log("Poll Id " + postId);
    }
  }

  refreshPoll() {
    this.pollsCol = this.afs.collection("posts").doc(postId).collection('polls', ref => ref.orderBy("timestamp"));
    this.polls = this.pollsCol.valueChanges();
    this.polls = this.pollsCol.snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Polls;
          const id = a.payload.doc.id;
          return { id, data };
        });
      });
  }

  submitPolls() {
    this.router.navigate(['/viewpoll/' + postId]);
  }

}


