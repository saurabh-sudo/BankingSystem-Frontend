import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: "root" })
export class UserService {
  constructor(private http: HttpClient) {}

  getAll(status: Number) {
    let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    return this.http.get(`${config.apiUrl}/accounts/getAllByStatus/${status}`, {
      headers: {
        Authorization: `${currentUser.token}`,
      },
    });
  }

  downloadFile(data: Object[], filename = "data") {
    let csvData = this.ConvertToCSV(data, [
      "accountId",
      "id",
      "firstName",
      "lastName",
      "date",
      "passportNumber",
      "uuid",
      "remarks",
      // "Reference Id",
      // "First Name",
      // "Last Name",
      // "Date of Application",
      // "Passport Number",
      // "Uuid",
      // "Remarks",
    ]);
    console.log(csvData);
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

  ConvertToCSV(objArray: string | Object[], headerList: string[]) {
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
      for (let index in headerList) {
        const proof = array[i]["proof"];
        console.log(proof);
        console.log(array[i][proof.uuid]);
        let head = headerList[index];

        if (head.includes("uuid") || head.includes("passportNumber")) {
          line += "," + proof[head];
        } else {
          console.log(":eske");
          line += "," + array[i][head];
        }
        //   line += "," + array[i][head];
      }
      str += line + "\r\n";
    }
    return str;
  }
}
