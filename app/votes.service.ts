import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import * as _ from "lodash";

@Injectable()
export class VotesService {
  userId: string;
  constructor( private afs: AngularFirestore,private afAuth: AngularFireAuth) {  this.afAuth.authState.subscribe(user => {
    if(user) this.userId = user.uid
  })

}

updateVote(postId,pollId) {
  const data = { [this.userId]: pollId }
  this.afs.doc(`votes/${postId}/users/${this.userId}`).update(data)
}

removeVote(postId) {
  this.afs.doc(`votes/${postId}/users/${this.userId}`).delete()
}

countVotes(pollId: Array<any>) {
  return _.mapValues(_.groupBy(pollId), 'length')
}
userVotes(pollId: Array<any>) {
  return _.get(pollId, this.userId)
}

}
