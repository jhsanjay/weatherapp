import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  durationInSeconds = 5;

  constructor(private _snackBar: MatSnackBar) { }

  // messages
  openSnackBar(messageString: string, flag) {
    this._snackBar.open(messageString, flag, {
      duration: this.durationInSeconds * 1000,
    });
  }
}
