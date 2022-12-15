import { Injectable } from '@angular/core';
// import { Overlay, OverlayRef } from '@angular/cdk/overlay';
// import { ComponentPortal } from '@angular/cdk/portal';
// import { SpinnerOverlayComponent } from '@app/core/spinner-overlay/spinner-overlay.component';
import { LoadingComponent } from '../dialogs/loading.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom, Observable } from 'rxjs';

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

  public showLoading() {
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
