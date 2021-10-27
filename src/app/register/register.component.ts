import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../services/authentication.service';
import { UserService } from '../services/user.service';
import { FaceApiService } from '../services/face-api-service.service';
import { WebcamImage } from 'ngx-webcam';

import { ToasterService } from 'angular2-toaster';

declare function unescape(s:string): string;
@Component({ templateUrl: 'register.component.html' })
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;
    selectedGroupId = 'test-group';
    webcamImage: WebcamImage | undefined;
    isMFAEnabled: boolean = false;
    audioblob: any;
    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private faceApi: FaceApiService,
        private toastr: ToasterService, 
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
            //baseURLText: ['', Validators.required],
            gender: ['', Validators.required]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    onSubmit() {
        this.submitted = true;
        this.loading = true;

        // reset alerts on submit
        // this.alertService.clear();

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        this.createPerson();
    }

    registerIntoDB(imageId, voiceId) {
        this.loading = true;
        var user = {
            contact: this.registerForm.value.contact,
            gender: this.registerForm.value.gender,
            name: this.registerForm.value.name,
            password: this.registerForm.value.password,
            azurePersonId: imageId,
            azureVoiceId: voiceId
        };
        this.userService.register(user)
            .pipe(first())
            .subscribe(
                data => {
                    this.toastr.pop('success', 'User Registeration Successful', '');
                    // this.alertService.success('Registration successful', true);
                    this.router.navigate(['/login']);
                },
                error => {
                    this.toastr.pop('error', 'User Registeration failed', '');
                    // this.alertService.error(error);
                    this.loading = false;
                });
    }

    createPerson() {
        let newPerson: any = { name: this.registerForm.value.name };
        this.faceApi.createPerson(this.selectedGroupId, newPerson).subscribe(data => {
            this.registerForm.value.azurePersonId = data.personId;
            var blob = this.dataURItoBlob(this.webcamImage.imageAsDataUrl);
            this.userService.uploadImage(blob).pipe().subscribe(imageId => {
                this.addBaseImage(data.personId, imageId);
            });
        });
    }

    addBaseImage(personId, imageId) {
        this.faceApi.addPersonFace(this.selectedGroupId, personId, imageId).subscribe(data => {
            this.userService.voiceEnroll(this.audioblob).subscribe(voiceId => {
                this.registerIntoDB(data.persistedFaceId, voiceId);
            });
        });
    }

    handleImage(webcamImage: WebcamImage) {
        this.webcamImage = webcamImage;
    }

    handleAudio(audio: any) {
        this.audioblob = audio;
    }

    updateMFA(): void {
        this.isMFAEnabled = !this.isMFAEnabled;
    }

    dataURItoBlob(dataURI: string) {
        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
        else
            byteString = unescape(dataURI.split(',')[1]);

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], { type: mimeString });
    }
}