import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../services/authentication.service';
import { UserService } from '../services/user.service';
import { User } from '../models/user';

import { environment  } from './../../environments/environment';


import Speech from 'speak-tts';

@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;

    // Speech Data
    speech: any;
    speechData: any;
    text = '';

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private userServce: UserService
       // private alertService: AlertService
    ) {
        this.speechInitialize();
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
       // this.alertService.clear();

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.login();
       
    }

    login(){
        this.loading = true;
       this.getLoggedInUserInfo(this.f.username.value, this.f.password.value);
    }

     getLoggedInUserInfo(userName, password) {
        this.userServce.getAll().subscribe(res => {
            var userInfo = res.filter(x => x.name == userName && x.password == password);
            if(userInfo == null || userInfo == undefined || userInfo.length == 0){
                this.loginFromBackend(null);
            }
            else{
                this.loginFromBackend(userInfo.shift());
            }
        });

    }

    loginFromBackend(userInfo){
        if(userInfo == null){
            alert('Not valid user');
            this.loading = false;
        }

        this.authenticationService.login(userInfo.id, userInfo.azurePersonId)
        //  .pipe(first())
        //
          .subscribe(
              data => {
                   // store user details and jwt token in local storage to keep user logged in between page refreshes
              localStorage.setItem('currentUser', JSON.stringify(userInfo));
              this.authenticationService.currentUserSubject.next(userInfo);
                this.start('Logged into FRP system.');
                  this.router.navigate(['home']);
                  this.loading = false;
              },
              error => {
                this.start('Unable to find user into FRP system.');
                //  this.alertService.error(error);
                alert('Not valid user');
                  this.loading = false;
              });
    }

    speechInitialize(){

        this.speech = new Speech() // will throw an exception if not browser supported
    if(this.speech .hasBrowserSupport()) { // returns a boolean
        console.log("speech synthesis supported")
        this.speech.init({
                'volume': 1,
                'lang': 'en-GB',
                'rate': 1,
                'pitch': 1,
                'voice':'Google UK English Male',
                'splitSentences': true,
                'listeners': {
                    'onvoiceschanged': (voices) => {
                        console.log("Event voiceschanged", voices)
                    }
                }
        }).then((data) => {
            // The "data" object contains the list of available voices and the voice synthesis params
            console.log("Speech is ready, voices are available", data)
            this.speechData = data;
            data.voices.forEach(voice => {
            console.log(voice.name + " "+ voice.lang)
            });
        }).catch(e => {
            console.error("An error occured while initializing : ", e)
        })
    }

    }

    start(message){
        // Retrieve the text property of the element (cross-browser support)
          this.speech.speak({
              text: message,
          }).then(() => {
              console.log("Success !")
          }).catch(e => {
              console.error("An error occurred :", e) 
          })
      }
}