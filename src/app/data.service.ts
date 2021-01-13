import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Router } from '@angular/router';
import { SocialAuthService } from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  loggedInUser;
<<<<<<< HEAD
  serverUrl = 'https://clinter.herokuapp.com/api';
=======
  serverUrl = 'https://clinterr.herokuapp.com/api';
>>>>>>> d697fc28e431d17eb7e382d8b99d3f3829d19f66

  constructor(public authService: SocialAuthService, private http: HttpClient, private _router:Router) { }

  signInWithGoogle(){
    //console.log('Data service sign with google');
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then( (usr) => this.loggedInUser = usr);
  }

  signOut(){
    this.authService.signOut();
  }
  register(user){
    this.http.post(this.serverUrl+'/register',user);
  }
  getTweets(q)
  {
      //console.log(q);
      return this.http.get(this.serverUrl+'/tweets'+q);
  }
  postTweet(tweet)
  {
      //console.log('postTweets Method called');
      return this.http.post(this.serverUrl+'/tweets',tweet);
  }
}
