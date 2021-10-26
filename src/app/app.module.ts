import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FaceApiService } from './services/face-api-service.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InputBoxComponent } from './input-box/input-box.component';
import { InputBoxService } from './input-box/input-box.service';
import { LoadingModule } from 'ngx-loading';
import { ToasterModule } from 'angular2-toaster';
import { ShoppingComponent } from './shopping/shopping.component';
import { FaceTesterComponent } from './face-tester/face-tester.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { ShoppingCartItemComponent } from './shopping-cart-item/shopping-cart-item.component';
import { CartService } from './services/cart.service';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthenticationService } from './services/authentication.service';
import { UserService } from './services/user.service';
import { AuthGuard } from './helpers/auth.guard';
import { SharedService } from './services/shared.service';
import { CameraComponent } from './camera/camera.component';
import { WebcamModule } from 'ngx-webcam';
import { AudioComponent } from './audio/audio.component';
import { AudioRecordingService } from './services/audio-recording.service';
import { TextVoiceConverterService } from './services/text-voice-converter.service';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    ConfigurationComponent,
    FaceTesterComponent,
    InputBoxComponent,
    ShoppingComponent,
    ShoppingCartComponent,
    ShoppingListComponent,
    ShoppingCartItemComponent,
    LoginComponent,
    RegisterComponent,
    CameraComponent,
    AudioComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    LoadingModule,
    ReactiveFormsModule,
    WebcamModule,
    NgbModule.forRoot(),
    ToasterModule.forRoot()
  ],
  providers: [
    FaceApiService,
    InputBoxService,
    CartService,
    AuthenticationService,
    UserService,
    AuthGuard,
    SharedService,
    AudioRecordingService,
    TextVoiceConverterService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    InputBoxComponent
  ]
})
export class AppModule { }
