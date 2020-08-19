import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'sh-date-picker',
  templateUrl: './sh-date-picker.component.html',
  styleUrls: ['./sh-date-picker.component.scss']
})
export class ShDatePickerComponent implements OnInit {
  @Input() selectedDateTime;
  @Output() dateSelect = new EventEmitter();

  public daysMap = moment.weekdays().map((day) => day.slice(0, 3).toUpperCase());
  public monthMap = moment.months();
  public shortMonthMap = moment.monthsShort();

  public isShowingDateView = true;
  public isShowingYearView = false;
  public isShowingMonthView = false;
  public monthDetails = [];
  public yearDetails = [];

  private oneDay = 60 * 60 * 24 * 1000;
  private todayTimestamp = Date.now() - (Date.now() % this.oneDay) + (new Date().getTimezoneOffset() * 1000 * 60);

  public selectedDay;
  public selectedYear;
  public selectedMonth;
  public currentDay;
  public currentYear;
  public currentMonth;

  private yearPaginatorPageSize = 28;
  private yearPaginatorOffset = 0;

  constructor() {

  }

  ngOnInit() {
    const date = new Date();
    this.currentYear = date.getFullYear();
    this.currentMonth = date.getMonth();
    this.currentDay = this.todayTimestamp;

    if (this.selectedDateTime) {
      this.selectedYear = this.selectedDateTime.getFullYear();
      this.selectedMonth = this.selectedDateTime.getMonth();
      this.selectedDay = new Date(this.selectedYear, this.selectedMonth, this.selectedDateTime.getDate()).getTime();
    } else {
      this.selectedYear = this.currentYear;
      this.selectedMonth = this.currentMonth;
      this.selectedDay = this.currentDay;
    }

    this.monthDetails = this.getMonthDetails(this.selectedYear, this.selectedMonth);

    this.yearPaginatorOffset = Math.floor((this.currentYear - this.selectedYear) / this.yearPaginatorPageSize);
    this.yearDetails = this.getYearDetails();
  }

  getMonthDetails(year, month) {
    const firstDay = (new Date(year, month)).getDay();
    const numberOfDays = this.getNumberOfDays(year, month);
    const monthArray = [];
    const rows = 6;
    let currentDay = null;
    let index = 0;
    const cols = 7;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        currentDay = this.getDayDetails({
          index,
          numberOfDays,
          firstDay,
          year,
          month
        });
        monthArray.push(currentDay);
        index++;
      }
    }
    return monthArray;
  }

  getNumberOfDays(year, month) {
    return 40 - new Date(year, month, 40).getDate();
  }

  getDayDetails(args) {
    const date = args.index - args.firstDay;
    const day = args.index % 7;
    let prevMonth = args.month - 1;
    let prevYear = args.year;
    if (prevMonth < 0) {
      prevMonth = 11;
      prevYear--;
    }
    const prevMonthNumberOfDays = this.getNumberOfDays(prevYear, prevMonth);
    const _date = (date < 0 ? prevMonthNumberOfDays + date : date % args.numberOfDays) + 1;
    const month = date < 0 ? -1 : date >= args.numberOfDays ? 1 : 0;
    const timestamp = new Date(args.year, args.month, _date).getTime();
    return {
      date: _date,
      day,
      month,
      timestamp,
      dayString: this.daysMap[day]
    };
  }

  isCurrentDay(monthDetail) {
    return monthDetail.timestamp === this.todayTimestamp && monthDetail.month === 0;
  }

  isSelectedDay(monthDetail) {
    return monthDetail.timestamp === this.selectedDay && monthDetail.month === 0;
  }

  onDateSelection(day) {
    this.selectedDay = day.timestamp;
    this.dateSelect.emit({
      selectedYear: this.selectedYear,
      selectedMonth: this.selectedMonth,
      selectedDate: day.date
    });
  }

  isCurrentYear(year) {
    return year === this.currentYear;
  }

  isSelectedYear(year) {
    return year === this.selectedYear;
  }

  onYearSelection(year) {
    this.selectedYear = year;
    this.isShowingYearView = false;
    this.isShowingMonthView = true;
    this.isShowingDateView = false;
  }

  isCurrentMonth(month) {
    return this.selectedYear === this.currentYear && month === this.monthMap[this.currentMonth];
  }

  isSelectedMonth(month) {
    return this.selectedYear === this.currentYear && month === this.selectedMonth;
  }

  onMonthSelection(month) {
    this.selectedMonth = month;

    this.monthDetails = this.getMonthDetails(this.selectedYear, this.selectedMonth);
    this.showDateView();
  }

  getMonthStr(month) {
    return this.monthMap[Math.max(Math.min(11, month), 0)] || 'Month';
  }

  getYearStr() {
    return this.yearDetails[0] + '-' + this.yearDetails[this.yearDetails.length - 1];
  }

  setMonth(offset) {
    let year = this.selectedYear;
    let month = this.selectedMonth + offset;

    if (month === -1) {
      month = 11;
      year--;
    } else if (month === 12) {
      month = 0;
      year++;
    }

    this.selectedYear = year;
    this.selectedMonth = month;
    this.monthDetails = this.getMonthDetails(year, month);
  }

  getYearDetails() {
    const paginatorMiddleYear = this.currentYear -
      (this.yearPaginatorOffset * this.yearPaginatorPageSize) - (this.yearPaginatorPageSize / 2);
    return Array.from({ length: this.yearPaginatorPageSize }, (v, i) =>
      paginatorMiddleYear + i + 1);
  }

  setYear(offset) {
    this.yearPaginatorOffset -= offset;
    this.yearDetails = this.getYearDetails();
  }

  showDateView() {
    this.isShowingYearView = false;
    this.isShowingMonthView = false;
    this.isShowingDateView = true;
  }

  toggleYearAndDateView() {
    this.isShowingMonthView = false;
    this.isShowingDateView = !this.isShowingDateView;
    this.isShowingYearView = !this.isShowingYearView;
  }

  toggleMonthView() {
    this.monthDetails = this.getMonthDetails(this.selectedYear, this.selectedMonth);
    this.showDateView();
  }

}
