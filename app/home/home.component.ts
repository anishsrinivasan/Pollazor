import { Component, OnInit, Input} from '@angular/core';
import { AuthService } from '../core/auth.service';
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { AngularFireAuth } from 'angularfire2/auth';
import { SeoService } from '../seo.service';

declare var $:any;
let userId;
let postId;
let newvote: number;
let newvoteupdate:any;
interface Posts {
  title: string;
  content: string;
}
interface Polls {
  title: string;
  content: string;
  rating:number;
}
let uservotes = [];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  

})
export class HomeComponent implements OnInit {
@Input() counter: any;
userId:string;
postsDoc: AngularFirestoreDocument<any>;
postsCol:AngularFirestoreCollection<any>;
posts: any;
pollsCol: AngularFirestoreCollection<any>;
polls: any;
postId:string;
recentpostsCol:any;
recentposts:any;
trendingpostsCol:any;
trendingposts:any;
recentpostid:any;
trendingpostid:any;
trending:any;
recent:any;
showSpinner=true;
leaderboardCol:any;
leaderboard:any;
email: string;
password: string;
  constructor(private afs: AngularFirestore,private afAuth: AngularFireAuth,private seo: SeoService,public auth: AuthService) { 
    this.seo.generateTags({
      title: "Pollazor", 
      description: "Let's Vote"
    })
    this.afAuth.authState.subscribe(user => {
      if(user) this.userId = user.uid
      console.log("This user Id is "+this.userId);
      
    })
  }
 
  ngOnInit() {
    this.recentpostsCol=this.afs.collection('posts',ref => ref.orderBy("timestamp","desc").limit(1));
    this.trendingpostsCol=this.afs.collection('posts',ref=> ref.orderBy("voteCount","desc").limit(1));
    this.afs.collection('posts'). ref.orderBy("timestamp","desc").limit(1).get()
    .then(querySnapshot => {
       querySnapshot.forEach(doc => {
       console.log(doc.data().postid);
       this.recentpostid=doc.data().postid;
    });
    })
    this.afs.collection('posts').ref.orderBy("voteCount","desc").limit(1).get()
    .then(querySnapshot => {
       querySnapshot.forEach(doc => {
       console.log(doc.data().postid);
       this.trendingpostid=doc.data().postid;
    });
    })
    this.recentposts = this.recentpostsCol.valueChanges()
    this.trendingposts = this.trendingpostsCol.valueChanges()
    this.postsCol=this.afs.collection('posts');
    this.posts = this.postsCol.valueChanges();
    this.leaderboardCol=this.afs.collection('users',ref => ref.orderBy("totalimpressions","desc").limit(3))
    this.leaderboard = this.leaderboardCol.valueChanges();
    this.posts.subscribe(() => this.showSpinner = false)
    this.trending=true;
  }

ngAfterViewInit(){
 
  }
  signin(): void {
    this.auth.emailLogin(this.email,this.password)
  }


filterposts(filter){
if(filter=="old"){
  this.showSpinner = true;
  this.postsCol=this.afs.collection('posts', ref => ref.orderBy("timestamp"));
  this.posts = this.postsCol.valueChanges();
  this.posts.subscribe(() => this.showSpinner = false)
}
else if(filter=="recent")
{ this.showSpinner = true;
  this.postsCol=this.afs.collection('posts', ref => ref.orderBy("timestamp","desc"));
  this.posts = this.postsCol.valueChanges();
  this.posts.subscribe(() => this.showSpinner = false)
} } 

toggleHeader(value){
  if(value===0){
  console.log("Value is "+value+" | So Trending")
   this.trending=true;
   this.recent=false;
  }
  if(value===1){
    console.log("Value is "+value+" | So Recent")
    this.recent=true;
    this.trending=false;
  }

}  



}
