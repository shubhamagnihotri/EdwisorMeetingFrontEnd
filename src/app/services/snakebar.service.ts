import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root'
})
export class SnakebarService {

  constructor(private _snackBar: MatSnackBar) { }

  openSnackBar(message: string, action: string) {
    let background="";
    if(action == 'success'){
      background = 'green-snackbar';
    }
    if(action == 'failed'){
      background = 'red-snackbar';
    }
    this._snackBar.open(message, action, {
      duration: 2000,
      // panelClass: [background]
    });
    
  }
}
