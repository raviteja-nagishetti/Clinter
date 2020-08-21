import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { SocialUser } from 'angularx-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private data:DataService, private _router:Router) { }

  ngOnInit() {
    this.data.authService.authState.subscribe((user) => {
      if(user)
      {
          console.log(JSON.stringify(user));
          this.data.register(user).subscribe(res => 
          {
            this._router.navigate(['/tweet']);
          }
      )
      }
      else
        this._router.navigate(['/']);
    });
  }
  signWithGoogle(){
    console.log('login');
    this.data.signInWithGoogle();
  }
}