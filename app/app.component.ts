import { Component } from '@angular/core';
import { CreatepollComponent } from './createpoll/createpoll.component';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { AngularFireAuth } from 'angularfire2/auth';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from './core/auth.service';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
let userId;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  constructor(private afs: AngularFirestore,private afAuth: AngularFireAuth,angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) { 
    
    
  }

  
  ngOnInit() {
}


}
