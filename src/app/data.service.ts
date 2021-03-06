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
  serverUrl = 'https://clinter.herokuapp.com/api';

  constructor(public authService: SocialAuthService, private http: HttpClient, private _router:Router) { }

  signInWithGoogle(){
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
  deleteTweet(tweet){
      return this.http.post(this.serverUrl+'/delete', tweet);
  }
}
