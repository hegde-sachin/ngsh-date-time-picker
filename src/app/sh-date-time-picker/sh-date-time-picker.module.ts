import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShDateTimePicker } from './sh-date-time-picker.component';
import { ShDateTimePickerInput } from './sh-date-time-picker-input.directive';
import { ShDateTimePickerOverlayComponent } from './sh-date-time-picker-overlay/sh-date-time-picker-overlay.component';
import { ShDateTimePickerInlineComponent } from './sh-date-time-picker-inline/sh-date-time-picker-inline.component';
import { ShDatePickerComponent } from './sh-date-time-picker-inline/sh-date-picker/sh-date-picker.component';
import { ShTimePickerComponent } from './sh-date-time-picker-inline/sh-time-picker/sh-time-picker.component';
import {
  ShTimePickerClockComponent
} from './sh-date-time-picker-inline/sh-time-picker/sh-time-picker-clock/sh-time-picker-clock.component';
import { SharedModule } from '../shared/shared.module';
import { ActiveHourPipe } from './sh-date-time-picker-inline/sh-time-picker/active-hour.pipe';
import { ActiveMinutePipe } from './sh-date-time-picker-inline/sh-time-picker/active-minute.pipe';
import { MinutesFormatterPipe } from './sh-date-time-picker-inline/sh-time-picker/minutes-formatter.pipe';



@NgModule({
  declarations: [
    ShDateTimePicker,
    ShDateTimePickerInput,
    ShDateTimePickerOverlayComponent,
    ShDateTimePickerInlineComponent,
    ShDatePickerComponent,
    ShTimePickerComponent,
    ShTimePickerClockComponent,
    ActiveHourPipe,
    ActiveMinutePipe,
    MinutesFormatterPipe
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    ShDateTimePicker,
    ShDateTimePickerInput,
    ShDateTimePickerInlineComponent
  ],
  entryComponents: [
    ShDateTimePickerOverlayComponent
  ]
})
export class ShDateTimePickerModule { }
