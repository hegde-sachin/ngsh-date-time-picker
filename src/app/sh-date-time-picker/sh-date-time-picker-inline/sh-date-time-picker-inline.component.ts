import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'sh-date-time-picker-inline',
  templateUrl: './sh-date-time-picker-inline.component.html',
  styleUrls: ['./sh-date-time-picker-inline.component.scss']
})
export class ShDateTimePickerInlineComponent implements OnInit, OnChanges {
  @Input() dateTimeValue;
  @Input() timeFormat = 24;
  @Input() pickerType = 'default';

  @Output() dateTimeSelection = new EventEmitter();
  @Output() dateTimeCancel = new EventEmitter();

  public isShowDatePicker = true;
  public isShowTimePicker = false;

  public datePickerEnabled = true;
  public timePickerEnabled = true;

  public selectedDateTime: Date;

  private selectedYear;
  private selectedMonth;
  private selectedDate;
  private selectedHour;
  private selectedMinute;
  private selectedSecond;

  constructor(

  ) { }

  ngOnInit() {

  }

  ngOnChanges() {
    this.setupDateTimePicker();
  }

  private setupDateTimePicker() {
    this.pickerType = this.pickerType ? this.pickerType : 'default';
    this.timeFormat = this.timeFormat ? +this.timeFormat : 24;

    if (this.pickerType === 'time' && this.dateTimeValue) {
      const date = new Date();

      const timeArray = this.dateTimeValue.split(':');
      this.dateTimeValue = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate(),
        timeArray[0] ? timeArray[0] : 0,
        timeArray[1] ? timeArray[1] : 0,
        timeArray[2] ? timeArray[2] : 0);
    }

    if (this.dateTimeValue && !isNaN(Date.parse(new Date(this.dateTimeValue).toString()))) {
      this.selectedDateTime = new Date(this.dateTimeValue);
    } else {
      this.selectedDateTime = new Date();
    }

    switch (this.pickerType) {
      case 'date':
        this.datePickerEnabled = true;
        this.timePickerEnabled = false;
        this.isShowDatePicker = true;
        this.isShowTimePicker = false;
        break;
      case 'time':
        this.datePickerEnabled = false;
        this.timePickerEnabled = true;
        this.isShowDatePicker = false;
        this.isShowTimePicker = true;
        break;
      default:
        this.datePickerEnabled = true;
        this.timePickerEnabled = true;
        this.isShowDatePicker = true;
        this.isShowTimePicker = false;
        break;
    }

    this.selectedYear = this.selectedDateTime.getFullYear();
    this.selectedMonth = this.selectedDateTime.getMonth();
    this.selectedDate = this.selectedDateTime.getDate();
    this.selectedHour = this.selectedDateTime.getHours();
    this.selectedMinute = this.selectedDateTime.getMinutes();
    this.selectedSecond = this.selectedDateTime.getSeconds();
  }

  onDateSelection(event) {
    this.selectedYear = event.selectedYear;
    this.selectedMonth = event.selectedMonth;
    this.selectedDate = event.selectedDate;

    this.setDateAndTime();

    if (this.pickerType === 'default') {
      this.isShowDatePicker = false;
      this.isShowTimePicker = true;
    }
  }

  ontimeSelection(event) {
    this.selectedHour = event.selectedHour;
    this.selectedMinute = event.selectedMinute;
    this.selectedSecond = event.selectedSecond;

    this.setDateAndTime();
  }

  private setDateAndTime() {
    switch (this.pickerType) {
      case 'date':
        this.selectedDateTime = new Date(this.selectedYear, this.selectedMonth, this.selectedDate);
        break;
      case 'time':
        this.selectedDateTime = new Date(this.selectedYear, this.selectedMonth, this.selectedDate,
          this.selectedHour, this.selectedMinute, this.selectedSecond);
        break;
      default:
        this.selectedDateTime = new Date(this.selectedYear, this.selectedMonth, this.selectedDate,
          this.selectedHour, this.selectedMinute, this.selectedSecond);
        break;
    }
  }

  toggleDateAndTimeView() {
    if (this.pickerType === 'default') {
      this.isShowDatePicker = !this.isShowDatePicker;
      this.isShowTimePicker = !this.isShowTimePicker;
    }
  }

  getDateString() {
    return moment.monthsShort()[this.selectedDateTime.getMonth()] + ' '
      + this.selectedDateTime.getDate() + ', ' + this.selectedDateTime.getFullYear();
  }

  getTimeString() {
    if (this.timeFormat === 12) {
      let hours = this.selectedDateTime.getHours();
      const meridiem = hours >= 12 ? 'PM' : 'AM';
      hours = (hours % 12) || 12;
      return hours + ' : ' + this.selectedDateTime.getMinutes() + ' : ' + this.selectedDateTime.getSeconds() + ' ' + meridiem;
    } else {
      return this.selectedDateTime.getHours() + ' : ' + this.selectedDateTime.getMinutes() + ' : ' + this.selectedDateTime.getSeconds();
    }
  }

  onDateTimeSelection() {
    if (this.pickerType === 'time') {
      this.dateTimeSelection.emit(this.selectedHour + ':' + this.selectedMinute + ':' + this.selectedSecond);
    } else {
      this.dateTimeSelection.emit(this.selectedDateTime);
    }
  }

  onDateTimeCancel() {
    this.dateTimeCancel.emit();
  }
}
