import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home";
import { LoginComponent } from "./login";
import { CreateComponent } from "./create";
import { AuthoriseComponent } from "./authorise";
import { AuthGuard } from "./_guards";

const appRoutes: Routes = [
  { path: "", component: HomeComponent, canActivate: [AuthGuard] },
  { path: "home/:id", component: HomeComponent, canActivate: [AuthGuard] },
  {
    path: "authoriser",
    component: AuthoriseComponent,
    canActivate: [AuthGuard],
  },
  { path: "login", component: LoginComponent },
  {
    path: "createNew/:id",
    component: CreateComponent,
    canActivate: [AuthGuard],
  },
  { path: "createNew", component: CreateComponent, canActivate: [AuthGuard] },
  // otherwise redirect to home
  { path: "**", redirectTo: "" },
];

export const routing = RouterModule.forRoot(appRoutes);
