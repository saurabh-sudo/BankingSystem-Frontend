import { Component, OnInit } from "@angular/core";
import { first } from "rxjs/operators";

import { User } from "../_models";
import { UserService } from "../_services";
import { NavbarService } from "../navbar/navbar.service";
import { NavbarComponent } from "../navbar";
import { Router, ActivatedRoute } from "@angular/router";

@Component({ templateUrl: "home.component.html" })
export class HomeComponent implements OnInit {
  users: User[] = [];
  accounts: null;
  account: null;

  currentUser: null;
  role: null;
  statusId: String;
  balanceFlag: boolean;
  result: Object[];
  customerName: null;

  constructor(
    private userService: UserService,
    public nav: NavbarService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.nav.isUserLoggedIn.next(true);
    let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    this.customerName = currentUser["customerName"];
    this.account = currentUser["accounts"];
  }

  checkBalance(accountId: Number) {
    this.userService.getBalance(accountId).subscribe(
      (res) => {
        this.accounts = JSON.parse(JSON.stringify(res));
        this.account = JSON.parse(JSON.stringify(res));
      },
      (error) => console.log(error)
    );
    this.balanceFlag = true;
    console.log(this.result);
  }
}
