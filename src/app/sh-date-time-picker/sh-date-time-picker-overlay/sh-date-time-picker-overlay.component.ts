import { Component, OnInit, HostBinding, Inject } from '@angular/core';
import { matDatepickerAnimations } from '@angular/material/datepicker';
import { SH_DATE_TIME_PICKER_OVERLAY_DATA } from './sh-date-time-picker-overlay-data';

@Component({
  selector: 'sh-date-time-picker-overlay',
  templateUrl: './sh-date-time-picker-overlay.component.html',
  styleUrls: ['./sh-date-time-picker-overlay.component.scss'],
  animations: [
    matDatepickerAnimations.transformPanel
  ]
})
export class ShDateTimePickerOverlayComponent implements OnInit {
  public dateTimeValue;
  public timeFormat;
  public pickerType;

  @HostBinding('@transformPanel') get panelTransition() {
    return 'enter';
  }

  constructor(
    @Inject(SH_DATE_TIME_PICKER_OVERLAY_DATA) public shDateTimePickerOverlayData
  ) { }

  ngOnInit() {
    this.dateTimeValue = this.shDateTimePickerOverlayData.dateTimeValue;
    this.timeFormat = +this.shDateTimePickerOverlayData.timeFormat;
    this.pickerType = this.shDateTimePickerOverlayData.pickerType;
  }

  onDateTimeSelection(selectedDateTime) {
    this.shDateTimePickerOverlayData.selectDateTimePicker(selectedDateTime);
  }

  onDateTimeCancel() {
    this.shDateTimePickerOverlayData.cancelDateTimePicker();
  }

}

