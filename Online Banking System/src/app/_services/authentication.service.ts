import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
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
    return this.http
      .post<any>(`${config.apiUrl}/login/customer/api/secured/token`, null, {
        headers: {
          Authorization: "Basic " + btoa(username + ":" + password),
        },
      })
      .pipe(
        map((user) => {
          if (user) {
            this.loggedIn.next(true);

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
          } else {
            console.log("Username or password is Incorrect");
          }

          return user;
        })
      );
  }

  approveAccount(account: Object, id: Number) {
    let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    return this.http.put(
      `${config.apiUrl}/accounts/approveAccount/${id}`,
      account,
      {
        headers: {
          Authorization: `${currentUser.token}`,
        },
      }
    );
  }

  declineAccount(account: Object, id: Number) {
    account["status"] = 2;
    let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    return this.http.put<any>(
      `${config.apiUrl}/accounts/declineAccountReq/${id}`,
      account,
      {
        headers: {
          Authorization: `${currentUser.token}`,
        },
      }
    );
  }

  transferAmount(transferObject: Object) {
    let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    return this.http.post<any>(
      `${config.apiUrl}/transfer/betweenAccounts`,
      transferObject,
      {
        headers: {
          Authorization: `${currentUser.token}`,
        },
      }
    );
  }
}
