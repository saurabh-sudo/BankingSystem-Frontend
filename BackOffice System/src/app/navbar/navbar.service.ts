import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class NavbarService {
  visible: boolean;

  public isUserLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);
}
