import { Component, OnInit, ViewChild } from '@angular/core';
import { FaceApiService } from '../services/face-api-service.service';
import * as _ from 'lodash';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { ToasterService } from 'angular2-toaster';
import { SharedService } from '../services/shared.service';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';

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

  constructor(private faceApi: FaceApiService, private toastr: ToasterService,
    private sharedService: SharedService,
    private cartService: CartService,
    private route: Router) { }

  ngOnInit() {
    let currentuser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentuser) {
      this.balance = currentuser.balance;
    }
    this.cartAmuont = this.sharedService.getCartAmount();
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
          this.toastr.pop('error', 'Payment failed', 'Not a valid user.');
          this.loading = false;
        }
      });

      // Call getPerson() for each identified face
      forkJoin(obsList).subscribe(results => {
        this.identifiedPersons = results;
        this.loading = false;
        this.toastr.pop('success', 'Payment Successful', 'Thansk you for shopping with us.');
        let currentuser = JSON.parse(localStorage.getItem('currentUser'));
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
      });
    });
  }

  imageLoaded($event) {
    this.selectedFace = null;
    this.detectedFaces = [];
    let img = this.mainImg.nativeElement;
    this.multiplier = img.clientWidth / img.naturalWidth;
  }
}
