import { Component, OnInit } from "@angular/core";
import { User } from "../_models";
import { UserService, AuthenticationService } from "../_services";
import { NavbarService } from "../navbar/navbar.service";
import { Router, ActivatedRoute } from "@angular/router";

@Component({ templateUrl: "authorise.component.html" })
export class AuthoriseComponent implements OnInit {
  users: User[] = [];
  currentUser: null;
  role: null;
  accounts: [];

  constructor(
    private userService: UserService,
    public router: Router,
    public nav: NavbarService,
    public auth: AuthenticationService
  ) {}

  ngOnInit() {
    this.nav.isUserLoggedIn.next(true);
    let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    this.currentUser = currentUser.adminName;
    let status = 1;

    this.userService.getAll(status).subscribe(
      (res) => {
        this.accounts = JSON.parse(JSON.stringify(res));
        this.accounts.sort((a, b) => Number(b["id"]) - Number(a["id"]));
      },
      (error) => console.log(error)
    );
  }
}
