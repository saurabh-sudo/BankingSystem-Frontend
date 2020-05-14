import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { routing } from "./app.routing";

import { BasicAuthInterceptor, ErrorInterceptor } from "./_helpers";
import { HomeComponent } from "./home";
import { LoginComponent } from "./login";
import { CreateComponent } from "./create";
import { NavbarComponent } from "./navbar/navbar.component";
import { NavbarService } from "./navbar/navbar.service";
import { AuthoriseComponent } from "./authorise";

@NgModule({
  imports: [BrowserModule, ReactiveFormsModule, HttpClientModule, routing],
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    CreateComponent,
    NavbarComponent,
    AuthoriseComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    // Here we register the NavbarService
    NavbarService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
