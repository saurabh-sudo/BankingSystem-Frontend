import { FormControl } from "@angular/forms";
import * as moment from "moment";

export function DateValidator(format = "MM/dd/YYYY"): any {
  return (control: FormControl): { [key: string]: any } => {
    const val = moment(control.value, format, true);

    if (!val.isValid()) {
      return { invalidDate: true };
    }

    return null;
  };
}
