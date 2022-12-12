import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { config } from 'rxjs';
import { QRCodeModule } from 'angularx-qrcode';


// const qr = require('qr-image');

@Component({
  selector: 'app-two-factor-auth',
  standalone: true,
  imports: [
    CommonModule,
    QRCodeModule,
  ],
  template: `
    <div>
<!--      <img #qrImage style="width: 160px; height: 160px;"/>-->
      <qrcode [qrdata]="config.otpAuthUrl" [width]="256" [errorCorrectionLevel]="'M'"></qrcode>
    </div>
  `,
  styles: []
})
export class TwoFactorAuthComponent {

  config = {
    "secret": "K4BG4AD7AB5DAMJW",
    "otpAuthUrl": "otpauth://totp/gummersbach-library:1123?secret=K4BG4AD7AB5DAMJW&period=30&digits=6&algorithm=SHA1&issuer=gummersbach-library"
  }



  // @ViewChild('qrImage') qrImg: ElementRef;

  // ngOnInit(): void {
  //     // this.generateQRCode();
  // }





  // private generateQRCode(): void {
  //   const nativeImage = this.qrImg.nativeElement;
  //   const pngStr = qr.imageSync(this.config.otpAuthUrl, {type: 'png', margin: 2});
  //   nativeImage.src = `data:image/png;base64,${pngStr.toString('base64')}`;
  // }
}
