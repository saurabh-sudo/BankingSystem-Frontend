import { NavbarService } from "../navbar/navbar.service";
import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthenticationService } from "../_services";
import { MustMatch } from "./MustMatch";

@Component({ templateUrl: "transaction.component.html" })
export class TransactionComponent implements OnInit {
  transferForm: FormGroup;
  currentUser: null;
  role: String;
  submitted = false;
  flag = "";
  authoriser: boolean;
  userId: String;
  accountApproved = false;
  accountDeclined = false;
  transferSuccessfull = false;
  accounts: Object[];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    public nav: NavbarService
  ) {
    this.transferSuccessfull = false;
    this.flag = route.snapshot.params["id"];
  }

  redirectTo(uri: string) {
    this.router
      .navigateByUrl("/", { skipLocationChange: true })
      .then(() => this.router.navigate([uri]));
  }

  get f() {
    return this.transferForm.controls;
  }

  ngOnInit() {
    this.transferSuccessfull = false;
    let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    this.accounts = currentUser["accounts"];

    this.transferForm = this.fb.group(
      {
        recipientName: ["", [Validators.required, Validators.minLength(5)]],
        phoneNo: ["", [Validators.pattern(/^[0-9]+$/)]],
        recipientAccountNo: [
          "",
          [
            Validators.required,
            Validators.pattern(/^[0-9]+$/),
            Validators.minLength(14),
          ],
        ],
        confirmAccountNo: [
          "",
          [
            Validators.required,
            Validators.pattern(/^[0-9]+$/),
            Validators.minLength(14),
          ],
        ],
        description: [""],
        amount: [
          "",
          [
            Validators.required,
            Validators.pattern(/^[0-9]+$/),
            Validators.max(1000000),
          ],
        ],
        accountId: ["", Validators.required],
        type: ["Normal Payment"],
      },
      {
        validator: MustMatch("recipientAccountNo", "confirmAccountNo"),
      }
    );
  }

  get recipientName() {
    return this.transferForm.get("recipientName");
  }
  get phoneNo() {
    return this.transferForm.get("phoneNo");
  }

  get recipientAccountNo() {
    return this.transferForm.get("recipientAccountNo");
  }
  get confirmAccountNo() {
    return this.transferForm.get("confirmAccountNo");
  }
  get description() {
    return this.transferForm.get("description");
  }
  get accountId() {
    return this.transferForm.get("accountId");
  }
  get amount() {
    return this.transferForm.get("amount");
  }

  cancelRequest() {
    this.router.navigate(["/"]);
  }

  onSubmit(flag: Number) {
    this.submitted = true;
    this.authenticationService
      .transferAmount(this.transferForm.value)
      .subscribe((response) => {
        this.transferSuccessfull = true;
      });
  }
}
