import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { User } from "../_models";

@Injectable({ providedIn: "root" })
export class UserService {
  getBalanceAmountOnly(UserAccountId: Number) {
    let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    return this.http.get(
      `${config.apiUrl}/transfer/balanceAmountOnly/${UserAccountId}`,
      {
        headers: {
          Authorization: `${currentUser.token}`,
        },
      }
    );
  }
  MultiplePayment(formdata: FormData) {
    let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    return this.http.post(
      `${config.apiUrl}/customers/scheduleTransaction`,
      formdata,
      {
        headers: {
          Authorization: `${currentUser.token}`,
        },
      }
    );
  }
  scheduleTransaction(formdata: FormData) {
    let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    return this.http.post(
      `${config.apiUrl}/customers/scheduleTransaction`,
      formdata,
      {
        headers: {
          Authorization: `${currentUser.token}`,
        },
      }
    );

    throw new Error("Method not implemented.");
  }
  getTransactionHistoryById(accountId: Number) {
    let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    return this.http.get(
      `${config.apiUrl}/transfer/transactionHistory/${accountId}`,
      {
        headers: {
          Authorization: `${currentUser.token}`,
        },
      }
    );
  }
  constructor(private http: HttpClient) {}

  getAll(status: Number) {
    let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    return this.http.get(`${config.apiUrl}/accounts/getAllByStatus/${status}`, {
      headers: {
        Authorization: `${currentUser.token}`,
      },
    });
  }
  getBalance(accountId: Number) {
    let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    return this.http.get(`${config.apiUrl}/transfer/balance/${accountId}`, {
      headers: {
        Authorization: `${currentUser.token}`,
      },
    });
  }

  downloadFile(data: Object[], filename = "data") {
    let csvData = this.ConvertToCSV(
      data,
      [
        "Transaction Id",
        "Date",
        "Transfer from",
        "Transfer to",
        "Receipient Name",
        "Amount",
        "Status",
        "Type of Transaction",
      ],
      [
        "id",
        "date",
        "accountId",
        "recipientAccountNo",
        "recipientName",
        "amount",
        "status",
        "type",
      ]
    );
    let blob = new Blob(["\ufeff" + csvData], {
      type: "text/csv;charset=utf-8;",
    });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser =
      navigator.userAgent.indexOf("Safari") != -1 &&
      navigator.userAgent.indexOf("Chrome") == -1;
    if (isSafariBrowser) {
      //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  ConvertToCSV(
    objArray: string | Object[],
    headerList: string[],
    headerListobject: string[]
  ) {
    debugger;
    let array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
    let str = "";
    let row = "S.No,";

    for (let index in headerList) {
      row += headerList[index] + ",";
    }
    row = row.slice(0, -1);
    str += row + "\r\n";
    for (let i = 0; i < array.length; i++) {
      let line = i + 1 + "";
      for (let index in headerListobject) {
        let head = headerListobject[index];
        line += "," + array[i][head];
      }
      str += line + "\r\n";
    }
    return str;
  }
}
