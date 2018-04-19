import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from '../core/auth.service';
import { Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  email: string;
  password: string;
  displayName:string;
  dateofbirth:string;
  gender:string;
  userId:any;

  constructor(private afs: AngularFirestore,private afAuth: AngularFireAuth,public auth: AuthService,private router: Router) { 
    this.afAuth.authState.subscribe(user => {
      if(user){ this.userId = user.uid

      }
      else {
        this.userId = null;
      }
     
      
    })
    
  }
  ngOnInit() {
  }
  signOut() {
    this.afAuth.auth.signOut().then(() => {
        this.router.navigate(['/']);
    });
}
}
