import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { routing } from "./app.routing";
import { BasicAuthInterceptor, ErrorInterceptor } from "./_helpers";
import { HomeComponent } from "./home";
import { LoginComponent } from "./login";
import { NavbarComponent } from "./navbar/navbar.component";
import { NavbarService } from "./navbar/navbar.service";
import { TransactionComponent } from "./transaction/transaction.component";
import { FormsModule } from "@angular/forms";
import { TransactionHistory } from "./transactionHistory";
import { NgxDaterangepickerMd } from "ngx-daterangepicker-material";
import { ScheduleComponent } from "./schedule";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CalendarModule } from "primeng/calendar";
import { TabViewModule } from "primeng/tabview";
import { CodeHighlighterModule } from "primeng/codehighlighter";
import { MultiPaymentComponent } from "./multiplePayment/MultiPayment.component";
import { CommonModule } from "@angular/common";

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    routing,
    FormsModule,
    BrowserAnimationsModule,
    CalendarModule,
    CommonModule,
    NgxDaterangepickerMd.forRoot(),
    TabViewModule,
    CodeHighlighterModule,
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    TransactionComponent,
    TransactionHistory,
    LoginComponent,
    NavbarComponent,
    ScheduleComponent,
    MultiPaymentComponent,
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
