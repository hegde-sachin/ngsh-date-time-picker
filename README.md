## Angular Date and Time Picker

An Angular component to pick date and/or time and supports Angular 9+.

### Dependencies
Install the dependenccies mentioned below
```markdown
npm install @angular/material
npm install @angular/flex-layout
npm install moment
npm install tinycolor2
```

### How to use
Import `ShDateTimePickerModule` into the module where you want to use `sh-date-time-picker`
```markdown
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ShDateTimePickerModule } from './sh-date-time-picker/sh-date-time-picker.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ShDateTimePickerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```
#### Basic Date and Time picker
```markdown
<mat-form-field appearance="outline">
  <mat-label>Choose a date</mat-label>
  <input matInput [shDateTimePicker]="shDateTimePicker" [formControl]="dateTimeControl" autocomplete="off">
  <sh-date-time-picker #shDateTimePicker></sh-date-time-picker>
</mat-form-field>
```
#### Inline Time picker
```markdown
<sh-date-time-picker-inline [pickerType]="time" [timeFormat]="12"></sh-date-time-picker-inline>
```

#### Demo
[https://ang-date-time-picker.web.app/](https://ang-date-time-picker.web.app/)

#### Screenshots
![Image 1](https://firebasestorage.googleapis.com/v0/b/ang-date-time-picker.appspot.com/o/img1.png?alt=media&token=529e54c2-f8b0-4b6e-8e58-aef43e97606c)
![Image 2](https://firebasestorage.googleapis.com/v0/b/ang-date-time-picker.appspot.com/o/img2.png?alt=media&token=539998c2-5744-4e4e-afde-b1039b245b10)
![Image 3](https://firebasestorage.googleapis.com/v0/b/ang-date-time-picker.appspot.com/o/img5.png?alt=media&token=d661c0c6-e165-42d9-b74b-69b744af6a66)
![Image 4](https://firebasestorage.googleapis.com/v0/b/ang-date-time-picker.appspot.com/o/img3.png?alt=media&token=04fa40dc-59a6-4825-8494-83bc6984705b)
![Image 5](https://firebasestorage.googleapis.com/v0/b/ang-date-time-picker.appspot.com/o/img4.png?alt=media&token=71c687db-136c-42c5-907d-256858ff6880)
