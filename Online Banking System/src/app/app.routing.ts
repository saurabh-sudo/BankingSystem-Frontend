import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home";
import { LoginComponent } from "./login";
import { ScheduleComponent } from "./schedule";
import { AuthGuard } from "./_guards";
import { TransactionComponent } from "./transaction/transaction.component";
import { TransactionHistory } from "./transactionHistory";
import { MultiPaymentComponent } from "./multiplePayment/MultiPayment.component";

const appRoutes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "", component: HomeComponent, canActivate: [AuthGuard] },
  {
    path: "transaction",
    component: TransactionComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "transHistory",
    component: TransactionHistory,
    canActivate: [AuthGuard],
  },
  { path: "schedule", component: ScheduleComponent, canActivate: [AuthGuard] },
  {
    path: "multiPayment",
    component: MultiPaymentComponent,
    canActivate: [AuthGuard],
  },

  { path: "**", redirectTo: "" },
];

export const routing = RouterModule.forRoot(appRoutes);
