import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import {  AuthenticationService } from '../services/authentication.service';
import { UserService } from '../services/user.service';
import { FaceApiService } from '../services/face-api-service.service';

@Component({ templateUrl: 'register.component.html' })
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;
    selectedGroupId = 'test-group';

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private faceApi: FaceApiService
        //private alertService: AlertService
    ) {
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            name: ['', Validators.required],
            contact: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]],
            baseURLText: ['', Validators.required],
            gender: ['', Validators.required]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        // this.alertService.clear();

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

       this.createPerson();
    }

    registerIntoDB(){
        this.loading = true;
        this.userService.register(this.registerForm.value)
            .pipe(first())
            .subscribe(
                data => {
                    // this.alertService.success('Registration successful', true);
                    this.router.navigate(['/login']);
                },
                error => {
                    // this.alertService.error(error);
                    this.loading = false;
                });
    }

    createPerson(){
        let newPerson: any = { name: this.registerForm.value.name };
        this.faceApi.createPerson(this.selectedGroupId, newPerson).subscribe(data => {
          // newPerson.personId = data.personId;
          this.registerForm.value.azurePersonId = data.personId;
          this.addBaseImage(data.personId);
         // this.registerIntoDB();
        });
    }

    addBaseImage(personId){
        this.faceApi.addPersonFace(this.selectedGroupId, personId, this.registerForm.value.baseURLText).subscribe(data => {
            this.registerIntoDB();
          });
    }
}