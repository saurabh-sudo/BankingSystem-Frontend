import { Component, OnInit } from "@angular/core";
import { first } from "rxjs/operators";
import { ViewChild, ElementRef } from "@angular/core";

import { User } from "../_models";
import { UserService } from "../_services";
import { NavbarService } from "../navbar/navbar.service";
import { NavbarComponent } from "../navbar";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  FormControl,
} from "@angular/forms";
import { CalendarModule } from "primeng/calendar";

declare var $: any; // Declaring $ as a variable so that we can use it to access jQuery

@Component({
  templateUrl: "multiPayment.component.html",
  styleUrls: ["./multiPayment.component.css"],
})
export class MultiPaymentComponent implements OnInit {
  @ViewChild("sd") sdate: ElementRef;
  dates: Date;

  @ViewChild("ed") edate: ElementRef;
  accounts: Object[];
  multiForm: FormGroup;
  viewSaveButton: Boolean;
  paymentSet: boolean;
  saveButtonDisable: Boolean;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    public nav: NavbarService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  get f() {
    return this.multiForm.controls;
  }

  cancelRequest() {
    console.log("cancel");

    this.router.navigate(["/"]);
  }

  ngOnInit() {
    console.log("ngoninit");
    let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    this.accounts = currentUser["accounts"];

    this.multiForm = new FormGroup({
      schedule: new FormArray([this.initRecipientList()]),
    });
  }
  date = new Date();

  initRecipientList() {
    this.viewSaveButton = true;
    this.saveButtonDisable = true;
    return new FormGroup({
      accountId: new FormControl("", Validators.required),
      recipientAccountNo: new FormControl("", Validators.required),
      amount: new FormControl("", Validators.required),
      dates: new FormControl(this.date),
      type: new FormControl("Multiple Payments"),
    });
  }

  schedule(form: any) {
    return form.controls.schedule.controls;
  }

  addData() {
    const control = <FormArray>this.multiForm.get("schedule");
    control.push(this.initRecipientList());
  }

  onSubmit() {
    this.userService.MultiplePayment(this.multiForm.value).subscribe(
      (response) => {
        this.paymentSet = true;
        console.log("scheduled");
      },

      (error) => console.error("Error while create new account is : ", error)
    );
  }
}
