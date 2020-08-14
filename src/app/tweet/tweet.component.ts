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
  tweet = {msg:'Test msg'};
  user ;
  constructor(private data:DataService,private router:Router) {
    this.user = data.currentUser;
   }

  ngOnInit() {
    this.data.getTweets('').subscribe(d => {
      console.log(JSON.stringify(d))
      this.msgArray = JSON.parse(JSON.stringify(d));
    });
  }

  onSubmit(){
    if(this.tweet.msg.length>0){
      var obj = {index:this.msgArray.length,user:this.user.username,msg:'',likeCount:0};
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
    this.msgArray[i].likeCount++;
    this.data.postTweet(this.msgArray[i]).subscribe(res => 
      {}
    )
  }
  logout(){
    this.router.navigate(['/login']);
  }
  mytweets()
  {
    this.data.getTweets('?username='+this.user.userid).subscribe(d => {
      this.msgArray = JSON.parse(JSON.stringify(d));
    });
  }
}
