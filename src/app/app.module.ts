import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { FakeWebApi } from './domain/shared/services/fake-web-api';
import { XHRBackend, Http, RequestOptions } from "@angular/http";
import { InterceptedHttp } from "./domain/shared/interceptors/Authentication.interceptor";
/*
 * Platform and Environment providers/directives/pipes
 */
import { RoutingModule } from './app.routing.module';

// App is our top level component
import { App } from './app.component';
import { AppState, InternalStateType } from './app.service';
import { GlobalState } from './global.state';
import { NgaModule } from './theme/nga.module';
import { PagesModule } from './pages/pages.module';

// Domain part of application
import { LoginModule } from './domain/login/login.module';
import { RegisterModule } from './domain/register/register.module';
import { DomainModule } from './domain/domain.module';
import { AuthGuardService } from './domain/shared/services/auth-guard.service';
import { UserService } from './domain/shared/services/user.service';

// Application wide providers
const APP_PROVIDERS = [
  AppState,
  GlobalState,
  AuthGuardService,
  UserService
];

export type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [App],
  declarations: [
    App
  ],
  imports: [ // import Angular's modules
    BrowserModule,
    HttpModule,
    InMemoryWebApiModule.forRoot(FakeWebApi, {
      passThruUnknownUrl: true,
      // delay: 3500
    }), // comment when real api is ready
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    NgaModule.forRoot(),
    NgbModule.forRoot(),
    PagesModule,
    LoginModule,
    RegisterModule,
    DomainModule,
    RoutingModule
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    APP_PROVIDERS,
    {
      provide: Http,
      useFactory: httpFactory,
      deps: [XHRBackend, RequestOptions]
    }
  ]
})

export class AppModule {

  constructor(public appState: AppState) {
  }
}

export function httpFactory(xhrBackend: XHRBackend, requestOptions: RequestOptions): Http {
    return new InterceptedHttp(xhrBackend, requestOptions);
}
