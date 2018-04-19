import { Component, OnInit } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router,ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { AngularFireAuth } from 'angularfire2/auth';
import { SeoService } from '../seo.service';

declare var $:any;
let userId;
let postId;
let pollId;
let newvote;
let uservotes = [];
interface Posts {
  title: string;
  content: string;
}
interface Polls {
  title: string;
  content: string;
  rating:number;
}
let prevvoteid;
let prevvoteid1;
let prevvote;
let seodata;
let viewpolldescription = ""
@Component({
  selector: 'app-viewpoll',
  templateUrl: './viewpoll.component.html',
  styleUrls: ['./viewpoll.component.scss']
})
export class ViewpollComponent implements OnInit {
  trackFbObjects = (idx, obj) => obj.$key;
id:string;
postsDoc: AngularFirestoreDocument<any>;
postsCol:AngularFirestoreCollection<any>;
posts: Observable<any>;
polls: Observable<any>;
pollsCol: AngularFirestoreCollection<any>;
votesCheckCol:AngularFirestoreCollection<any>;
recentpostsCol:AngularFirestoreCollection<any>;
recentposts:any;
votesCheck:any;
votecheckflag:any;
seodata:any;
votes: any;
userId:any;
uservote:any;
checkuservote:any;

  constructor(private route: ActivatedRoute,private afs: AngularFirestore,private afAuth: AngularFireAuth,private router: Router,private seo: SeoService) {
    this.route.params.subscribe(param => {
      this.id = param["id"];
      console.log("1.Post Id "+this.id)
    })
    this.afAuth.authState.subscribe(user => {
      if(user) this.userId = user.uid
      userId = this.userId
      console.log("2. User Authenticated "+userId)
      var refreshpost = this.refreshpost(userId,this.id);
    })

   }

  ngOnInit() {
  
 
  }

  refreshpost(userId,postId){
    let index =1
    console.log("3. Refresh Post "+postId)
    var promise = this.checkUserVotes(userId,postId);   
    const seoref = this.afs.collection('posts', ref => ref.where('postid', '==',postId));
    this.seodata = seoref.valueChanges();
    this.seodata.subscribe(data => {
      console.log(data[0].topPolls)
      data[0].topPolls.forEach(doc => {
      viewpolldescription = viewpolldescription + index +"."+ doc.polltitle +" ";
      index = index + 1;
        console.log(viewpolldescription)
    });
      this.seo.generateTags({
        title: data[0].title, 
        description: viewpolldescription, 
        image: data[0].postimage, 
        slug: data[0].postid,
      })
    })
    this.postsCol=this.afs.collection('posts', ref => ref.where('postid', '==',postId));
    this.posts = this.postsCol.valueChanges();
    
      this.pollsCol=this.afs.collection("posts").doc(postId).collection("polls",ref => ref.orderBy('timestamp'));
      this.polls = this.pollsCol.valueChanges();
      this.polls = this.pollsCol.snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Polls;
          const id = a.payload.doc.id;
          pollId = id;
          return { id, data };
        });
      });
      
      this.recentpostsCol=this.afs.collection("posts",ref => ref.limit(3))
      this.recentposts = this.recentpostsCol.valueChanges();       
     
  }
 
seorender(postid){
  if(postid){
    console.log("ID Found"+postid)
  
}else{
  console.log("Too late to get postid");
}
}


checkUserVotes(userId,postId){
  console.log("4. Check User Vote "+userId+ "Post Id "+postId)
  if(userId){
 const checkvoteRef = this.afs.collection("votes").doc(postId).collection("users", ref => ref.where('userid', '==',userId));
 this.checkuservote = checkvoteRef.valueChanges();
 return this.checkuservote.subscribe(data => {
   console.log(data)
  if(data[0] != null){
   console.log("Prev Vote Exists");
   prevvoteid = data[0].pollid;
   console.log("checkuservotes"+prevvoteid)
   return true;
  }else{
    console.log("Prev Vote doesn't exists");
    return false
  }
 })
}else{
  console.log("Not Logged In");
}
 }
  ngAfterViewInit(){  
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.11&appId=552594601759869";
  
      if (d.getElementById(id)){
        //if <script id="facebook-jssdk"> exists
        delete (<any>window).FB;
        fjs.parentNode.replaceChild(js, fjs);
      } else {
        fjs.parentNode.insertBefore(js, fjs);
      }
    }(document, 'script', 'facebook-jssdk'));
  }

//Add New Vote Function
  addVote(postId,pollId){
console.log("Adding Vote"+pollId)
    //if userId Valid
    if(this.userId){

    const pollsRef = this.afs.collection("posts").doc(postId).collection("polls");
    const votesRef = this.afs.collection("votes").doc(postId).collection("users");
    votesRef.doc(this.userId).set({'userid':this.userId,'pollid':pollId})
    //if it's already Voted for same poll
    if(prevvoteid == pollId){
      console.log("Already Voted - You shall not pass")
      alert("You Shall Not Pass");
    }
    else{
      //if Previous Vote Exists
    if(prevvoteid){
      prevvoteid1 = prevvoteid;
      console.log("Already Exists, So delete and Update " +prevvoteid+" postId "+postId);
       this.afs.collection("posts").doc(postId).collection("polls").doc(prevvoteid).ref.get().then(function(doc){
        if (doc.exists) {
            prevvote = parseInt(doc.data().votes);
            console.log("Before Deleting Prev Vote"+prevvote);
            prevvote = prevvote - 1;
            console.log("After Deleting Prev Vote"+prevvote);
            return prevvote;
          } else {
            console.log("No such document! for Prev Poll ");
        }
    }).then(function(prevvote){
      console.log("Prev Poll Updated"+prevvote+" Prevvote Id "+prevvoteid1)
      pollsRef.doc(prevvoteid1).update({'votes':prevvote,'updatedat':new Date()})
  
    })
    this.votes = pollsRef.doc(pollId).ref.get().then(function(doc){
      if (doc.exists) {
          newvote = parseInt(doc.data().votes);
          console.log("Before Adding New Vote"+newvote);
          newvote = newvote + 1;
          console.log("After Adding New Vote"+newvote+"for poll id "+pollId);
          return newvote;
        } else {
          console.log("No such document!");
      }
  }).then(function(newvote){
    console.log("Updating New vote"+pollId+" New vote val "+newvote)
    pollsRef.doc(pollId).update({'votes':newvote,'updatedat':new Date()})
    console.log("New Polls Updated")
  })
  
      }
      else { //if there's no Previous Vote
        console.log("No Prev Vote so directly adding new vote")
        this.votes = pollsRef.doc(pollId).ref.get().then(function(doc){
          if (doc.exists) {
              newvote = parseInt(doc.data().votes);
              console.log("Before Adding New Vote"+newvote);
              newvote = newvote+1;
              console.log("After Adding New Vote"+newvote);
              return newvote;
            } else {
              console.log("No such document!");
          }
      }).then(function(newvote){
        pollsRef.doc(pollId).update({'votes':newvote,'updatedat':new Date()})
        console.log("New Polls Updated")
        console.log("New Votes Table Updated")
      })
          }
  }}else{
    alert("Please Login to Vote");
    this.router.navigate(['/userprofile']);
  }
  }
  



checkVote(pollId){
  if(prevvoteid){
return prevvoteid == pollId
  }
}


}
