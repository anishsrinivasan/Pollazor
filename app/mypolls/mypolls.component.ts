import { Component, OnInit } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { AngularFireAuth } from 'angularfire2/auth';

interface Posts {
  title: string;
  content: string;
}


interface PostId extends Posts { 
  id: string; 
}
let postId: string;
let userId: string;
let newvote: number;
@Component({
  selector: 'app-mypolls',
  templateUrl: './mypolls.component.html',
  styleUrls: ['./mypolls.component.css']
})
export class MypollsComponent implements OnInit {

  postsDoc: AngularFirestoreDocument<any>;
  postsCol:AngularFirestoreCollection<any>;
  posts: any;
  pollsCol: AngularFirestoreCollection<any>;
  votesCol:AngularFirestoreCollection<any>;
  userId:string;
  postId:string;
  
  constructor(private afs: AngularFirestore,private afAuth: AngularFireAuth) { 
    this.afAuth.authState.subscribe(user => {
      if(user) this.userId = user.uid
      console.log("This user Id is "+this.userId);
      var promise = this.refreshposts(this.userId)
    })
  }

 

  ngOnInit() {
     
}

refreshposts(userId){
  this.postsCol=this.afs.collection('posts', ref => ref.where('uid', '==',userId));
  this.posts = this.postsCol.snapshotChanges()
    .map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Posts;
        const id = a.payload.doc.id;
        postId=id;
        return { id, data };
      });
    });
   
}
deletePost(postId) {
  this.afs.doc('posts/'+postId).delete();
  alert("Post Deleted");
}




}