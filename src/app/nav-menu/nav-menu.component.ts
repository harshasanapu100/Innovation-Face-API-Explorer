import { Component, OnInit } from '@angular/core';

import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

//import { AuthenticationService } '../services/authentication.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {

  constructor(   private router: Router,
    private authenticationService : AuthenticationService ) { }

   ngOnInit() {
  }

  logOut(){

    this.authenticationService.logout();
    this.router.navigate(['/login']);

  }

}
