import { Injectable } from '@angular/core';
// import { Overlay, OverlayRef } from '@angular/cdk/overlay';
// import { ComponentPortal } from '@angular/cdk/portal';
// import { SpinnerOverlayComponent } from '@app/core/spinner-overlay/spinner-overlay.component';
import { LoadingComponent } from '../dialogs/loading.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom, Observable } from 'rxjs';
import { SelectBookComponent } from '../pages/select-book.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  // private overlayRef: OverlayRef = null;
  private dialogRef?: MatDialogRef<any>;

  constructor(
    // private overlay: Overlay
    public dialog: MatDialog,
  ) {}

  public choseBookInventory(): Promise<number> {
    if (this.dialogRef) {
      this.hide();
    }

    const dialogRef = this.dialog.open(SelectBookComponent, {
      panelClass: 'no-background',
      disableClose: true,
      autoFocus: true,
    });

    this.dialogRef = dialogRef;

    return new Promise<number>(resolve => {
      const dialogSubmitSubscription = dialogRef.componentInstance.submitClicked.subscribe(
        result => {
          console.log('Got the data!', result);
          // do something here with the data
          dialogSubmitSubscription.unsubscribe();
          this.hide();
          resolve(result as any);
        },
      );
    });
  }

  public showLoading() {
    if (this.dialogRef) {
      this.hide();
    }

    this.dialogRef = this.dialog.open(LoadingComponent, {
      panelClass: 'no-background',
      disableClose: true,
      autoFocus: true,
    });
  }

  // show() {
  // // Returns an OverlayRef (which is a PortalHost)
  //
  // if (!this.overlayRef) {
  //   this.overlayRef = this.overlay.create();
  // }
  //
  // // Create ComponentPortal that can be attached to a PortalHost
  // const spinnerOverlayPortal = new ComponentPortal(SpinnerOverlayComponent);
  // const component = this.overlayRef.attach(spinnerOverlayPortal); // Attach ComponentPortal to PortalHost
  // }

  public hide() {
    if (this.dialogRef) {
      this.dialogRef.close();
      this.dialogRef = undefined;
    }
    // if (this.overlayRef) {
    //   this.overlayRef?.detach();
    // }
  }

  async showLoadingUntil<T>(source: Observable<T>): Promise<T> {
    this.showLoading();

    return firstValueFrom(source).then(
      res => {
        this.hide();
        return res;
      },
      err => {
        this.hide();
        return Promise.reject(err);
      },
    );
  }
}
