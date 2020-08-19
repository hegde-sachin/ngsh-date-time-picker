# Angular Date and Time Picker

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




