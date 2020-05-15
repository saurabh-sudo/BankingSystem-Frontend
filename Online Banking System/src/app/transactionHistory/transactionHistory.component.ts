import { Component, OnInit } from "@angular/core";
import { User } from "../_models";
import { UserService } from "../_services";
import { NavbarService } from "../navbar/navbar.service";
import { NavbarComponent } from "../navbar";
import { Router, ActivatedRoute } from "@angular/router";
import { NgxDateRangePickerOptions } from "ngx-daterangepicker";

import * as moment from "moment";
import { FormBuilder } from "@angular/forms";
declare const require: any;
const jsPDF = require("jspdf");
require("jspdf-autotable");

@Component({ templateUrl: "transactionHistory.component.html" })
export class TransactionHistory implements OnInit {
  selected: any;
  invalidDates: moment.Moment[] = [];
  tooltips = [
    { date: moment(), text: "Today is just unselectable" },
    { date: moment().add(2, "days"), text: "Yeeeees!!!" },
  ];
  ranges = {
    Today: [moment(), moment()],
    Yesterday: [moment().subtract(1, "days"), moment().subtract(1, "days")],
    "Last 7 Days": [moment().subtract(6, "days"), moment()],
    "Last 30 Days": [moment().subtract(29, "days"), moment()],
    "This Month": [moment().startOf("month"), moment().endOf("month")],
    "Last Month": [
      moment().subtract(1, "month").startOf("month"),
      moment().subtract(1, "month").endOf("month"),
    ],
    "Last 3 Month": [
      moment().subtract(3, "month").startOf("month"),
      moment().subtract(1, "month").endOf("month"),
    ],
  };
  form = this.formBuilder.group({
    selected: {
      startDate: moment().subtract(1, "days").set({ hours: 0, minutes: 0 }),
      endDate: moment().subtract(1, "days").set({ hours: 23, minutes: 59 }),
    },
    alwaysShowCalendars: true,
    keepCalendarOpeningWithRange: true,
    showRangeLabelOnInput: true,
  });

  users: User[] = [];
  accounts: Object[];
  transactionList: Object[];
  transactionListFiltered: Object[];
  currentUser: null;
  role: null;
  accountId: String;
  rejectedAccounts: Boolean;
  hideData: Boolean;
  activeAccount: Boolean;
  fileName: string;
  startDate: string;
  endDate: string;
  filterData: Boolean;
  // options: NgxDateRangePickerOptions;

  constructor(
    private userService: UserService,
    public nav: NavbarService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.route.params.subscribe((params) => {
      this.ngOnInit();
    });
  }

  isInvalidDate = (m: moment.Moment) => {
    return this.invalidDates.some((d) => d.isSame(m, "day"));
  };

  isTooltipDate = (m: moment.Moment) => {
    const tooltip = this.tooltips.find((tt) => tt.date.isSame(m, "day"));
    if (tooltip) {
      return tooltip.text;
    } else {
      return false;
    }
  };

  rangeClicked(range: any): void {}

  ngOnInit() {
    this.hideData = false;
    this.rejectedAccounts = false;
    this.activeAccount = false;
    this.fileName = "TransactionList";
    this.nav.isUserLoggedIn.next(true);
    var statusValue;

    let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    this.accounts = currentUser["accounts"];
    let ad = this.accounts[0];
    statusValue = ad["accountId"];

    this.userService.getTransactionHistoryById(statusValue).subscribe(
      (res) => {
        this.transactionList = JSON.parse(JSON.stringify(res));
        this.transactionListFiltered = JSON.parse(JSON.stringify(res));
        // this.transactionList = this.transactionList.filter((obj1) => {
        //   var localDate = new Date(obj1["date"]);

        //   //     return obj1["id"] == accountId;
        // });

        for (var i in this.transactionList) {
          var abc = this.transactionList[i];

          var d = new Date(abc["date"]);
          //  var n = d.toLocaleString();
          abc["date"] = d.toLocaleString();

          this.transactionList[i] = abc;
        }

        this.transactionList.sort((a, b) => Number(b["id"]) - Number(a["id"]));
        this.transactionListFiltered = this.transactionList;
      },
      (error) => console.log("Error in getAll is : ", error)
    );
  }

  generatePdf() {
    let doc = new jsPDF("l", "pt");
    const header = [
      [
        "Transaction Id",
        "Transaction Date",
        "Sender Account No",
        "Recipient Account No",
        "Recipient Name",
        "Amount",
        "Status",
        "type",
      ],
    ];
    var rows: Object[] = [];
    const data = this.transactionListFiltered;
    //   this.iterate(data);

    data.forEach((elm) => {
      const proof = elm["proof"];

      const temp = [
        elm["id"],
        elm["date"],
        elm["accountId"],
        elm["recipientAccountNo"],
        elm["recipientName"],
        elm["amount"],
        elm["status"],
        elm["type"],
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
    this.userService.downloadFile(this.transactionListFiltered, this.fileName);
  }

  onSubmit(range: any) {
    this.filterData = true;

    var startDate = new Date(this.startDate);
    var endDate = new Date(this.endDate);

    this.transactionListFiltered = this.transactionList.filter(function (a) {
      // var hitDates = a["date"] || {};

      var date = new Date(a["date"]);
      return date >= startDate && date <= endDate;
      // extract all date strings
      //   hitDates = Object.keys(hitDates);
      //   // improvement: use some. this is an improment because .map()
      //   // and .filter() are walking through all elements.
      //   // .some() stops this process if one item is found that returns true in the callback function and returns true for the whole expression
      //   var hitDateMatchExists = hitDates.some(function (dateStr: any) {
      //     var date = new Date(dateStr);
      //     return date >= startDate && date <= endDate;
      //   });
      //   return hitDateMatchExists;
    });

    // result = this.accounts.filter((obj1) => {
    //     return obj1["id"] == accountId;
    //   });

    // this.transactionList = this.transactionList.filter((obj1) => {
    //     return obj1["date"] == accountId;
    //   });
    // this.transactionList.filter(f)
  }

  datesUpdated(range: any) {
    this.startDate = range.startDate._d;
    this.endDate = range.endDate._d;
  }
}
