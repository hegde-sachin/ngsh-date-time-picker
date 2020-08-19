import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { angularMaterialModule } from './angular-material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BypassSecurityTrustStylePipe } from './pipes/bypass-security-trust-style.pipe';


@NgModule({
  declarations: [
    BypassSecurityTrustStylePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ...angularMaterialModule,
    FlexLayoutModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    ...angularMaterialModule,
    FlexLayoutModule,
    BypassSecurityTrustStylePipe
  ]
})
export class SharedModule { }
