import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NavbarService } from "../navbar/navbar.service";
import { AuthenticationService } from "../_services";

@Component({
  templateUrl: "create.component.html",
  styleUrls: ["./create.component.css"],
})
export class CreateComponent implements OnInit {
  registrationForm: FormGroup;
  currentUser: null;
  role: String;
  submitted = false;
  flag = "";
  authoriser: boolean;
  userId: String;
  accountApproved = false;
  accountDeclined = false;
  createSuccessful = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    public nav: NavbarService
  ) {
    this.createSuccessful = false;
    this.flag = route.snapshot.params["id"];
  }

  redirectTo(uri: string) {
    this.router
      .navigateByUrl("/", { skipLocationChange: true })
      .then(() => this.router.navigate([uri]));
  }

  get f() {
    return this.registrationForm.controls;
  }

  ngOnInit() {
    this.createSuccessful = false;
    this.userId = this.route.snapshot.paramMap.get("id");
    this.registrationForm = this.fb.group({
      firstName: ["", [Validators.required, Validators.minLength(3)]],
      lastName: ["", [Validators.required, Validators.minLength(3)]],
      remarks: ["", [Validators.required, Validators.minLength(3)]],
      bankIfsc: ["", [Validators.required]],
      accountId: [""],
      phoneNo: [
        "",
        [
          Validators.pattern(/^[0-9]+$/),
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      proof: this.fb.group({
        emailId: ["", [Validators.required, Validators.email]],
        uuid: [
          "",
          [
            Validators.required,
            Validators.minLength(15),
            Validators.pattern(/^[a-zA-Z0-9]+$/),
          ],
        ],
        passportNumber: [
          "",
          [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{8}$/)],
        ],
        dob: [],
        age: [],
      }),
    });

    if (Number(this.userId) != 0) {
      this.authenticationService
        .getAdminById(Number(this.userId))
        .subscribe((data) => {
          this.registrationForm.patchValue(data);
        });
    }
    let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    let admin = currentUser.adminRole[0].roleName;

    admin === "AUTHORISER"
      ? (this.authoriser = true)
      : (this.authoriser = false);
  }

  get firstName() {
    return this.registrationForm.get("firstName");
  }
  get lastName() {
    return this.registrationForm.get("lastName");
  }
  get phoneNo() {
    return this.registrationForm.get("phoneNo");
  }
  get uuid() {
    return this.registrationForm.get("proof.uuid");
  }
  get dob() {
    return this.registrationForm.get("proof.dob");
  }
  get passportNumber() {
    return this.registrationForm.get("proof.passportNumber");
  }
  get emailId() {
    return this.registrationForm.get("proof.emailId");
  }
  get age() {
    return this.registrationForm.get("proof.age");
  }
  get remarks() {
    return this.registrationForm.get("remarks");
  }

  get accountId() {
    return this.registrationForm.get("accountId");
  }

  get bankIfsc() {
    return this.registrationForm.get("bankIfsc");
  }

  cancelRequest() {
    console.log("cancel");

    this.router.navigate(["/"]);
  }

  onSubmit(flag: Number) {
    this.submitted = true;
    let today = new Date().toISOString().slice(0, 10);
    this.registrationForm.value.date = today;

    if (flag === 1) {
      this.registrationForm.value.accountStatus = 1;
    } else if (flag === 2) {
      this.registrationForm.value.accountStatus = 2;
    } else {
      this.registrationForm.value.accountStatus = 3;
    }

    if (Number(this.userId) != null && Number(this.userId) == 0) {
      console.log(this.registrationForm.value);
      this.authenticationService
        .createNewAccount(this.registrationForm.value)
        .subscribe(
          (response) => {
            this.createSuccessful = true;
          },

          (error) =>
            console.error("Error while create new account is : ", error)
        );
    } else {
      this.authenticationService
        .updateAccount(this.registrationForm.value, Number(this.userId))
        .subscribe(
          (response) => {
            if (flag === 1) {
              this.createSuccessful = true;
            } else if (flag === 2) {
              this.accountDeclined = true;
            } else {
              this.accountApproved = true;
            }
          },

          (error) => console.error("Error while updateAccount is : ", error)
        );
    }
  }
}
