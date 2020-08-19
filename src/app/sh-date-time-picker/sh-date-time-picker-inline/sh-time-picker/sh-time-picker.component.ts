import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TimeUnit } from './time-unit-enum';
import { TimePickerUtils } from './time-picker-utils';

@Component({
  selector: 'sh-time-picker',
  templateUrl: './sh-time-picker.component.html',
  styleUrls: ['./sh-time-picker.component.scss']
})
export class ShTimePickerComponent implements OnInit {
  @Input() selectedDateTime: Date;
  @Input() timeFormat = 24;

  @Output() timeSelection = new EventEmitter();

  public timeSelectionMode: 'hour' | 'minute' | 'second' = 'hour';

  public hourSelectionMode = true;

  public hourSelected = {
    angle: 360,
    time: 12
  };

  public minuteSelected = {
    angle: 0,
    time: 0
  };

  public secondSelected = {
    angle: 0,
    time: 0
  };

  public meridiem = new FormControl('');

  public faceTime = [];
  public hoursList = [];
  public minutesList = [];
  public secondsList = [];
  public selectedTime;
  public timeUnit = TimeUnit;

  constructor(

  ) { }

  ngOnInit() {
    if (!this.timeFormat) {
      this.timeFormat = 24;
    }

    this.hoursList = TimePickerUtils.getHours(+this.timeFormat);
    this.minutesList = TimePickerUtils.getMinutes();
    this.secondsList = TimePickerUtils.getMinutes();

    if (this.selectedDateTime) {
      let selectedHour = this.selectedDateTime.getHours();
      selectedHour = this.convertHour(selectedHour);
      this.hourSelected = this.hoursList.find((hour) => hour.time === selectedHour);

      const selectedMinute = this.selectedDateTime.getMinutes();
      this.minuteSelected = this.minutesList.find((minute) => minute.time === selectedMinute);

      const selectedSecond = this.selectedDateTime.getSeconds();
      this.secondSelected = this.secondsList.find((second) => second.time === selectedSecond);
    }

    this.loadFaceTimeValues();
  }



  onTimeSelected(e) {
    switch (this.timeSelectionMode) {
      case 'hour':
        this.hourSelected = e;
        this.timeSelectionMode = 'minute';
        break;
      case 'minute':
        this.minuteSelected = e;
        this.timeSelectionMode = 'second';
        break;
      case 'second':
        this.secondSelected = e;
        this.timeSelectionMode = 'hour';
        break;
    }

    this.loadFaceTimeValues();
    this.generateSelectedTime();
  }

  generateSelectedTime() {
    this.timeSelection.emit({
      selectedHour: this.formatHour(),
      selectedMinute: this.minuteSelected.time,
      selectedSecond: this.secondSelected.time
    });
  }

  loadFaceTimeValues() {
    switch (this.timeSelectionMode) {
      case 'hour':
        this.faceTime = this.hoursList;
        this.selectedTime = this.hourSelected;
        break;
      case 'minute':
        this.faceTime = this.minutesList;
        this.selectedTime = this.minuteSelected;
        break;
      case 'second':
        this.faceTime = this.secondsList;
        this.selectedTime = this.secondSelected;
        break;
    }
  }

  selectTimePickerMode(mode) {
    this.timeSelectionMode = mode;
    this.loadFaceTimeValues();
  }

  selectMeridiem(meridiem) {
    this.meridiem.setValue(meridiem);
    this.generateSelectedTime();
  }

  convertHour(hours) {
    if (+this.timeFormat === 12) {
      this.meridiem.setValue(hours >= 12 ? 'pm' : 'am');
      return (hours % 12) || 12;
    } else {
      return hours;
    }
  }

  formatHour() {
    if (+this.timeFormat === 12) {
      const hour = this.hourSelected.time;
      if (this.meridiem.value === 'pm') {
        if (hour === 12) {
          return '00';
        } else {
          return hour + 12;
        }
      } else {
        return hour;
      }
    } else {
      return this.hourSelected.time;
    }
  }
}
