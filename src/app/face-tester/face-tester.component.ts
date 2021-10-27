import { Component, OnInit, ViewChild } from '@angular/core';
import { FaceApiService } from '../services/face-api-service.service';
import * as _ from 'lodash';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { ToasterService } from 'angular2-toaster';
import { SharedService } from '../services/shared.service';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';

import { TextVoiceConverterService } from '../services/text-voice-converter.service';
import { WebcamImage } from 'ngx-webcam';
import { UserService } from '../services/user.service';

declare function unescape(s: string): string;

@Component({
  selector: 'app-face-tester',
  templateUrl: './face-tester.component.html',
  styleUrls: ['./face-tester.component.css']
})
export class FaceTesterComponent implements OnInit {
  loading = false;
  public detectedFaces: any;
  public identifiedPersons = [];
  public imageUrl: string;
  public multiplier: number;
  public personGroups = [];
  public selectedFace: any;
  public selectedGroupId = '';
  public cartAmuont: number = 0;
  public balance: number = 0;
  @ViewChild('mainImg') mainImg;
  webcamImage: WebcamImage | undefined;
  webcamImageUrl: any;
  audioblob: any;
  isVoiceAuthenticated: boolean = false;
  isVoiceChecked: boolean = false;

  constructor(private faceApi: FaceApiService, private toastr: ToasterService,
    private sharedService: SharedService,
    private cartService: CartService,
    private textVoiceCon: TextVoiceConverterService,
    private route: Router,
    private userService: UserService,) {

  }

  ngOnInit() {
    let currentuser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentuser) {
      this.balance = currentuser.balance;
    }
    this.cartAmuont = this.sharedService.getCartAmount();
    this.textVoiceCon.start(`Total order value for the current transaction is ${this.cartAmuont}`);
    this.loading = true;
    this.faceApi.getPersonGroups().subscribe(data => {
      this.personGroups = data;
      this.loading = false;
    });
  }

  detect() {
    this.loading = true;
    this.faceApi.detect(this.imageUrl).subscribe(data => {
      this.detectedFaces = data;
      console.log('**detect results', this.detectedFaces);
      this.loading = false;
    });

  }

  faceClicked(face) {
    this.selectedFace = face;
    if (this.selectedFace.identifiedPersonId) {
      let identifiedPerson = _.find(this.identifiedPersons, { 'personId': face.identifiedPersonId });
      this.selectedFace.name = identifiedPerson.name;
    }
  }

  identify() {
    let faceIds = _.map(this.detectedFaces, 'faceId');
    this.loading = true;

    //NOTE: for Production app, max groups of 10
    this.faceApi.identify(this.selectedGroupId, faceIds).subscribe(identifiedFaces => {
      console.log('**identify results', identifiedFaces);
      let obsList = [];

      _.forEach(identifiedFaces, identifiedFace => {
        if (identifiedFace.candidates.length > 0) {
          let detectedFace = _.find(this.detectedFaces, { faceId: identifiedFace.faceId });
          detectedFace.identifiedPerson = true;
          detectedFace.identifiedPersonId = identifiedFace.candidates[0].personId;
          detectedFace.identifiedPersonConfidence = identifiedFace.candidates[0].confidence;
          obsList.push(this.faceApi.getPerson(this.selectedGroupId, identifiedFace.candidates[0].personId));
        }
        else {
          this.textVoiceCon.start(`Payment has been failed due to face authentication`);
          
          if (!this.isVoiceAuthenticated) {
            this.textVoiceCon.start(`Payment has been failed due to voice authentication`);
          }
          this.toastr.pop('error', 'Payment failed', 'Not a valid user.');
          this.loading = false;
        }
      });

      // Call getPerson() for each identified face
      forkJoin(obsList).subscribe((results: any) => {
        let currentuser = JSON.parse(localStorage.getItem('currentUser'));
        this.identifiedPersons = results[0].persistedFaceIds;
        this.userService.authenticateFace(currentuser.id, this.identifiedPersons[0]).subscribe(res => {
          if (res && this.isVoiceAuthenticated) {
            this.loading = false;
            this.textVoiceCon.start(`Your order has been Successful placed`);
            this.toastr.pop('success', 'Payment Successful', 'Thansk you for shopping with us.');
            if (currentuser) {
              this.balance = currentuser.balance;
            }
            let data = {
              "Id": -1,
              "UserId": currentuser.id,
              "Amount": this.cartAmuont,
              "NoOfItems": 3
            }
            this.cartService.checkOutCart(data).subscribe(res => {
              this.cartAmuont = 0;
              setTimeout(() => {
                this.route.navigate(['/shopping'])
              }, 4000);
            });
          }
          else {
            if (!res) {
              this.textVoiceCon.start(`Payment has been failed due to face authentication`);
            }

            if (!this.isVoiceAuthenticated) {
              this.textVoiceCon.start(`Payment has been failed due to voice authentication`);
            }

            this.toastr.pop('error', 'Payment failed', 'Not a valid user.');
            this.loading = false;
          }
        });

      });
    });
  }

  imageLoaded($event) {
    this.selectedFace = null;
    this.detectedFaces = [];
    let img = this.mainImg.nativeElement;
    this.multiplier = img.clientWidth / img.naturalWidth;
  }

  handleImage(webcamImage: WebcamImage) {
    this.webcamImage = webcamImage;
    var blob = this.dataURItoBlob(this.webcamImage.imageAsDataUrl);
    this.userService.uploadImage(blob).pipe().subscribe((imageId: string) => {
      this.imageUrl = imageId;
      console.log(imageId);
    });
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

  handleAudio(audio: any) {
    this.audioblob = audio;
    let currentuser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentuser) {
      this.userService.authenticateVoice(this.audioblob, currentuser.id).subscribe((voiceId: boolean) => {
        this.isVoiceAuthenticated = voiceId;
        this.isVoiceChecked = true;       
      });
    }
  }

  isIdentifyButtonDisable(): boolean {
    if (!this.selectedGroupId || (this.imageUrl && !this.imageUrl.length) || !this.isVoiceChecked) {
      return true;
    }
    else if (this.selectedGroupId && !this.imageUrl || !this.isVoiceChecked) {
      return true;
    }
    return false;
  }
}
