import { Component, OnInit } from "@angular/core";
import { first } from "rxjs/operators";
import { User } from "../_models";
import { UserService } from "../_services";
import { NavbarService } from "../navbar/navbar.service";
import { NavbarComponent } from "../navbar";
import { Router, ActivatedRoute } from "@angular/router";
declare const require: any;
const jsPDF = require("jspdf");
require("jspdf-autotable");
//declare var jsPDF: any;
@Component({ templateUrl: "home.component.html" })
export class HomeComponent implements OnInit {
  users: User[] = [];
  accounts: Object[];
  currentUser: null;
  role: null;
  statusId: String;
  rejectedAccounts: Boolean;
  hideData: Boolean;
  activeAccount: Boolean;
  fileName: string;

  constructor(
    private userService: UserService,
    public nav: NavbarService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.params.subscribe((params) => {
      this.ngOnInit();
    });
  }

  ngOnInit() {
    this.hideData = false;
    this.rejectedAccounts = false;
    this.activeAccount = false;
    this.fileName = null;
    this.nav.isUserLoggedIn.next(true);
    var statusValue;
    this.statusId = this.route.snapshot.paramMap.get("id");
    if (Number(this.statusId) === 1) {
      statusValue = 1;
      this.hideData = true;
      this.fileName = "submittedData";
    } else if (Number(this.statusId) === 2 || this.statusId == null) {
      statusValue = 2;
      this.rejectedAccounts = true;
      this.fileName = "RejectedData";
    } else {
      statusValue = 3;
      this.activeAccount = true;
      this.fileName = "CreatedAccounts";
      let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    }

    let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    this.currentUser = currentUser.adminName;
    this.role = currentUser.adminRole[0].roleName;

    this.userService.getAll(statusValue).subscribe(
      (res) => {
        this.accounts = JSON.parse(JSON.stringify(res));
        this.accounts.sort((a, b) => Number(b["id"]) - Number(a["id"]));
      },
      (error) => console.log("Error in getAll is : ", error)
    );
  }

  generatePdf() {
    let doc = new jsPDF("l", "pt");
    const header = [
      [
        "Account ID",
        "Reference ID",
        "First Name",
        "Last Name",
        "Date of Application",
        "Passport Number",
        "Uuid",
        "Remarks",
      ],
    ];
    var rows: Object[] = [];
    const data = this.accounts;
    const proofData = this.accounts["proof"];
    //   this.iterate(data);

    data.forEach((elm) => {
      const proof = elm["proof"];

      const temp = [
        elm["accountId"],
        elm["id"],
        elm["firstName"],
        elm["lastName"],
        elm["date"],
        proof["uuid"],
        proof["passportNumber"],
        elm["remarks"],
      ];
      rows.push(temp);
    });

    doc.text(20, 20, this.fileName);
    doc.autoTable({
      head: header,
      body: rows,
    });

    if (this) doc.save(this.fileName + ".pdf");
  }

  generateCsv() {
    this.userService.downloadFile(this.accounts, this.fileName);
  }
}
