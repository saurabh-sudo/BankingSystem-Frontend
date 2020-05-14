import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NavbarService } from "./navbar.service";
import { AuthenticationService } from "../_services";

@Component({
  selector: "app-navbar",
  moduleId: module.id,
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit {
  isUserLoggedIn: boolean;
  authoriser: boolean;
  loggedIn: boolean;

  constructor(
    private router: Router,
    private nav: NavbarService,
    private auth: AuthenticationService
  ) {
    // Subscribe here, this will automatically update
    // "isUserLoggedIn" whenever a change to the subject is made.
    this.nav.isUserLoggedIn.subscribe((value) => {
      this.isUserLoggedIn = value;
    });
  }

  ngOnInit() {
    let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    if (currentUser === "" || currentUser === null) {
    } else {
      let admin = currentUser.adminRole[0].roleName;
      admin === "AUTHORISER"
        ? (this.authoriser = true)
        : (this.authoriser = false);
    }
  }

  logout() {
    this.nav.isUserLoggedIn.next(false);
    sessionStorage.removeItem("currentUser");
    this.router.navigate(["/login"]);
  }
}
