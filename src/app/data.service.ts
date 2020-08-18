import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  currentUser;//= {username:'', userid:''};
  serverUrl = 'http://localhost:3000/api';

  constructor(private http:HttpClient,private router:Router) { }

  register(body){
   // console.log(JSON.stringify(body));
    return this.http.post(this.serverUrl+'/register',body);
  }
  login()
  {
    console.log('Data Service login');
    return this.http.get(this.serverUrl+'/google');
  }
  user(user)
  {
    //console.log(JSON.stringify(user));
    this.currentUser = user;
    return;
  }
  getTweets(q)
  {
      console.log('getTweets Method called:');
      return this.http.get(this.serverUrl+'/tweets'+q);
  }
  postTweet(tweet)
  {
      console.log('postTweets Method called');
      //alert(JSON.stringify(tweet));
      return this.http.post(this.serverUrl+'/tweets',tweet);
  }
}
