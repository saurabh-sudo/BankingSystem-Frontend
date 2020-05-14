import { Component, OnInit } from "@angular/core";
import { first } from "rxjs/operators";
import { ViewChild, ElementRef } from "@angular/core";
import { AbstractControl } from "@angular/forms";

import { User } from "../_models";
import { UserService } from "../_services";
import { NavbarService } from "../navbar/navbar.service";
import { NavbarComponent } from "../navbar";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { CalendarModule } from "primeng/calendar";

declare var $: any; // Declaring $ as a variable so that we can use it to access jQuery

@Component({
  templateUrl: "schedule.component.html",
  styleUrls: ["./schedule.component.css"],
})
export class ScheduleComponent implements OnInit {
  @ViewChild("sd") sdate: ElementRef;
  dates: Date;

  @ViewChild("ed") edate: ElementRef;
  accounts: Object[];
  scheduleForm: FormGroup;
  viewSaveButton: Boolean;
  scheduleComplete: Boolean;
  totalAmountScheduled: Number;
  presentAmount: number;
  UserAccountId: number;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    public nav: NavbarService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.scheduleForm = this.fb.group({
      //  name: [],
      schedule: this.fb.array([]).push(
        this.fb.group({
          recipientName: ["", [Validators.required, Validators.minLength(5)]],
          recipientAccountNo: [
            "",
            [
              Validators.required,
              Validators.pattern(/^[0-9]+$/),
              Validators.minLength(14),
            ],
          ],
          dates: ["", [Validators.required, this.ValidateDate]],
          amount: [
            "",
            [
              Validators.required,
              Validators.pattern(/^[.\d]+$/),
              Validators.max(this.presentAmount),
            ],
          ],
          accountId: [""],
          type: ["scheduled"],
          // accountId: ["", Validators.required],
        })
      ),
    });
  }
  get f() {
    return this.scheduleForm.controls;
  }

  ValidateDate(control: AbstractControl) {
    console.log(control.value);
    if (!control.value.startsWith("https") || !control.value.includes(".io")) {
      return { validUrl: true };
    }
    return null;
  }
  cancelRequest() {
    console.log("cancel");

    this.router.navigate(["/"]);
  }
  ngOnInit() {
    console.log("ngoninit");
    let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    this.accounts = currentUser["accounts"];
    this.UserAccountId = this.accounts[0]["accountId"];

    this.userService.getBalanceAmountOnly(this.UserAccountId).subscribe(
      (res) => {
        this.presentAmount = JSON.parse(JSON.stringify(res));

        console.log(this.presentAmount);
      },
      (error) => console.log(error)
    );
    this.scheduleForm = this.fb.group({
      schedule: this.fb.array([]),
    });
  }

  get recipientName() {
    return this.scheduleForm.get("recipientName");
  }

  get recipientAccountNo() {
    return this.scheduleForm.get("recipientAccountNo");
  }

  get accountId() {
    return this.scheduleForm.get("accountId");
  }
  get amount() {
    console.log("getamiunt", this.scheduleForm.get("schedule.amount"));

    return this.scheduleForm.get("schedule.amount");
  }

  addData() {
    // this.myForm.get('child.id')

    const add = this.scheduleForm.get("schedule") as FormArray;
    add.push(
      this.fb.group({
        type: ["scheduled"],

        recipientName: ["", [Validators.required, Validators.minLength(5)]],
        recipientAccountNo: [
          "",
          [
            Validators.required,
            Validators.pattern(/^[0-9]+$/),
            Validators.minLength(14),
          ],
        ],
        dates: [""],
        amount: [
          "",
          [
            Validators.required,
            Validators.max(this.presentAmount),
            Validators.pattern(/^[0-9]+$/),
          ],
        ],
        accountId: [""],
        // accountId: ["", Validators.required],
      })
    );
    this.viewSaveButton = true;
  }

  onSubmit() {
    this.userService.scheduleTransaction(this.scheduleForm.value).subscribe(
      (response) => {
        this.scheduleComplete = true;
        console.log("scheduled");
      },

      (error) => console.error("Error while create new account is : ", error)
    );
  }
}
