import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from '../data.service';
//import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user;
  loginForm : FormGroup=new FormGroup({
    email:new FormControl(null,[Validators.email,Validators.required]),
    password:new FormControl(null, Validators.required)
  });
  constructor(private _router:Router, private data:DataService) { }

  ngOnInit() {
  }
  login(){
      if(!this.loginForm.valid)
       { console.log('Invalid');
        return;
      }
      var query = '?';
      query +='email='+this.loginForm.controls.email.value;
      query +='&password='+this.loginForm.controls.password.value;
     this.data.login(query).subscribe(d => {
       this.user = d;
      // console.log(d);
       if(this.user.message == 'success'){
        this.data.user(this.user)
          {
            this._router.navigate(['/tweet']);
          }
       }
    });
  }
  moveToRegister(){
    this._router.navigate(['/register']);
  }
}