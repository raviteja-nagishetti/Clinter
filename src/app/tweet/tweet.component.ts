import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tweet',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.css']
})
export class TweetComponent implements OnInit {
  msgArray = [];
  isMsgValid=false;
  tweet = {msg: "What"+"'s"+" happening?"};
  user ;
  constructor(private data:DataService,private router:Router) {
    this.user = data.loggedInUser;
   }

  ngOnInit() {
    this.data.getTweets('').subscribe(d => {
      this.msgArray = JSON.parse(JSON.stringify(d));
    });
  }

  onSubmit(){
    if(this.tweet.msg.length>0){
      
      var obj = {index:this.msgArray.length,user:this.user.firstName,msg:'',likeCount:0, google_id:this.user.id,likers:[]};
      obj.msg = this.tweet.msg;
      this.msgArray.unshift(obj);
      this.data.postTweet(obj).subscribe(res => 
        {}
      )
      this.tweet.msg = '';
      this.isMsgValid=false;
    }
  }

  enableSubmitButton(){
    if(this.tweet.msg.length>0){
      this.isMsgValid=true;
    }
    else{
      this.isMsgValid=false;
    }
  }

  like(i){
    let luck = this.msgArray[i].likers;
    let index = 0;
    for(let g_id of luck){
      if(g_id == this.user.id)
      {
        this.msgArray[i].likeCount--;
        this.msgArray[i].likers.splice(index, 1);
        this.data.postTweet(this.msgArray[i]).subscribe(res => 
          {}
        )
        return;
      }
      index++;
    }
    this.msgArray[i].likeCount++;
    this.msgArray[i].likers.push(this.user.id);
    this.data.postTweet(this.msgArray[i]).subscribe(res => 
      {}
    )
  }
  isLiked(likers){
    let luck = likers;
    for(let g_id of luck){
      if(g_id == this.user.id)
        return true;
    }
    return false;
  }
  logout(){
    this.data.signOut();
  }
  mytweets()
  {
    this.data.getTweets('?username='+this.user.id).subscribe(d => {
      this.msgArray = JSON.parse(JSON.stringify(d));
    });
  }
}
