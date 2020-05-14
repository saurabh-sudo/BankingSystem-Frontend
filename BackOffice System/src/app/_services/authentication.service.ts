import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";

import { map } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class AuthenticationService {
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string) {
    console.log(btoa(username + ":" + password));

    return this.http
      .post<any>(`${config.apiUrl}/login/api/secured/token`, null, {
        headers: {
          Authorization: "Basic " + btoa(username + ":" + password),
        },
      })
      .pipe(
        map((user) => {
          if (user) {
            this.loggedIn.next(true);
            console.log(user);

            sessionStorage.setItem("currentUser", JSON.stringify(user));
          } else {
            console.log("Username or password is Incorrect");
          }

          return user;
        })
      );
  }

  logout() {
    this.loggedIn.next(false);
    this.router.navigate(["/login"]);
  }

  createNewAccount(formData: FormData) {
    let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    return this.http
      .post<any>(`${config.apiUrl}/accounts/add`, formData, {
        headers: {
          Authorization: `${currentUser.token}`,
        },
      })
      .pipe(
        map((user) => {
          if (user) {
          } else {
            console.log("Username or password is Incorrect");
          }

          return user;
        })
      );
  }

  updateAccount(formData: FormData, id: Number) {
    let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    return this.http.put<any>(
      `${config.apiUrl}/accounts/update/${id}`,
      formData,
      {
        headers: {
          Authorization: `${currentUser.token}`,
        },
      }
    );
  }

  getAdminById(userId: Number) {
    let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    return this.http
      .get(`${config.apiUrl}/accounts/getById/${userId}`, {
        headers: {
          Authorization: `${currentUser.token}`,
        },
      })
      .pipe(
        map((user) => {
          if (user) {
            console.log(user);
          } else {
            console.log("Username or password is Incorrect");
          }

          return user;
        })
      );
  }
}
