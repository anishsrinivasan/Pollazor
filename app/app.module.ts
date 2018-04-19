import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { ShareButtonsModule } from 'ngx-sharebuttons';
// Other imports removed for brevity
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { CreatepollComponent } from './createpoll/createpoll.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AuthService } from './core/auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthGuard } from './core/auth.guard';
import {MypollsComponent} from './mypolls/mypolls.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { HomeComponent } from './home/home.component';
import { ViewpollComponent } from './viewpoll/viewpoll.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SeoService } from './seo.service';
import { ProfileComponent } from './profile/profile.component';
import { FooterComponent } from './footer/footer.component';
import { LoadingSpinnerComponent } from './ui/loading-spinner/loading-spinner.component';

// Paste in your credentials that you saved earlier
var firebaseConfig = {
  apiKey: "AIzaSyB7CF6_9P_Tt1WqQoeKyO5ctsaktXr2zI8",
  authDomain: "pollozor-2dcdb.firebaseapp.com",
  databaseURL: "https://pollozor-2dcdb.firebaseio.com",
  projectId: "pollozor-2dcdb",
  storageBucket: "pollozor-2dcdb.appspot.com",
  messagingSenderId: "896315217970"
};


const appRoutes: Routes = [
  { path: 'createpoll', component: CreatepollComponent,  canActivate : [AuthGuard]   },
  { path: 'userprofile', component: UserProfileComponent, },
  {path: '#',component:CreatepollComponent},
  {path:'mypolls', component: MypollsComponent},
  {path:'', component: HomeComponent},
  {path:':userid',component:ProfileComponent},
  {path:'viewpoll/:id',component:ViewpollComponent},
];


@NgModule({
  declarations: [
    AppComponent,
    CreatepollComponent,
    UserProfileComponent,
    MypollsComponent,
    HomeComponent,
    ViewpollComponent,
    NavbarComponent,
    ProfileComponent,
    FooterComponent,
    LoadingSpinnerComponent
  ],
  imports: [
    BrowserModule,BrowserAnimationsModule, HttpClientModule, // (Required) for share counts
    HttpClientJsonpModule, // (Optional) For linkedIn & Tumblr counts ShareButtonsModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig), ShareButtonsModule.forRoot(),AngularSvgIconModule, // Add this
    AngularFirestoreModule,FormsModule ,
    Angulartics2Module.forRoot([Angulartics2GoogleAnalytics]),MDBBootstrapModule.forRoot(),
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    )                           // And this
  ],schemas: [ NO_ERRORS_SCHEMA ],
  
  providers: [AuthService,AngularFireAuth,AuthGuard, SeoService,],
  bootstrap: [AppComponent]
})
export class AppModule { }
