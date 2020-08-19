import {
  Component, OnInit, ViewChild, ElementRef, HostListener, Output, EventEmitter, OnDestroy, AfterViewInit, Input, OnChanges, SimpleChanges
} from '@angular/core';
import { TimeUnit } from '../time-unit-enum';

const CLOCK_HAND_STYLES = {
  small: {
    height: '75px',
    top: 'calc(50% - 75px)'
  },
  large: {
    height: '103px',
    top: 'calc(50% - 103px)'
  }
};

@Component({
  selector: 'sh-time-picker-clock',
  templateUrl: './sh-time-picker-clock.component.html',
  styleUrls: ['./sh-time-picker-clock.component.scss']
})
export class ShTimePickerClockComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @Input() faceTime = [];
  @Input() selectedTime;
  @Input() unit;
  @Input() format;

  @Output() timeChange = new EventEmitter();
  @Output() timeSelected = new EventEmitter();

  @ViewChild('clockFace', { static: true }) clockFace: ElementRef;
  @ViewChild('clockHand', { static: true }) clockHand: ElementRef;

  public isClockFaceDisabled = false;
  public innerClockFaceSize = 85;
  minutesGap;
  public timeUnit = TimeUnit;

  private isStarted: boolean;
  private touchStartHandler: () => any;
  private touchEndHandler: () => any;

  constructor(

  ) { }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.setClockHandPosition();
    this.addTouchEvents();
  }

  ngOnChanges(changes: SimpleChanges) {
    const faceTimeChanges = changes['faceTime'];
    const selectedTimeChanges = changes['selectedTime'];

    if ((faceTimeChanges && faceTimeChanges.currentValue)
      && (selectedTimeChanges && selectedTimeChanges.currentValue)) {
      this.selectedTime = this.faceTime.find(time => time.time === this.selectedTime.time);
    }

    if (selectedTimeChanges && selectedTimeChanges.currentValue) {
      this.setClockHandPosition();
    }

    if (faceTimeChanges && faceTimeChanges.currentValue) {
      setTimeout(() => this.selectAvailableTime());
    }
  }

  private setClockHandPosition(): void {
    if (this.format) {
      if (this.selectedTime.time > 12 || this.selectedTime.time === 0) {
        this.decreaseClockHand();
      } else {
        this.increaseClockHand();
      }
    } else {
      this.increaseClockHand();
    }

    if (this.selectedTime) {
      this.clockHand.nativeElement.style.transform = `rotate(${this.selectedTime.angle}deg)`;
    }
  }

  private decreaseClockHand(): void {
    this.clockHand.nativeElement.style.height = CLOCK_HAND_STYLES.small.height;
    this.clockHand.nativeElement.style.top = CLOCK_HAND_STYLES.small.top;
  }

  private increaseClockHand(): void {
    this.clockHand.nativeElement.style.height = CLOCK_HAND_STYLES.large.height;
    this.clockHand.nativeElement.style.top = CLOCK_HAND_STYLES.large.top;
  }

  trackByTime(time): string | number {
    return time.time;
  }

  @HostListener('mousedown', ['$event'])
  onMousedown(e: any) {
    e.preventDefault();
    this.isStarted = true;
  }

  @HostListener('click', ['$event'])
  @HostListener('touchmove', ['$event.changedTouches[0]'])
  @HostListener('touchend', ['$event.changedTouches[0]'])
  @HostListener('mousemove', ['$event'])
  selectTime(e: any): void {
    if (!this.isStarted && (e instanceof MouseEvent && e.type !== 'click')) {
      return;
    }
    const clockFaceCords = this.clockFace.nativeElement.getBoundingClientRect();

    const centerX = clockFaceCords.left + clockFaceCords.width / 2;
    const centerY = clockFaceCords.top + clockFaceCords.height / 2;

    const arctangent = Math.atan(Math.abs(e.clientX - centerX) / Math.abs(e.clientY - centerY)) * 180 / Math.PI;

    const circleAngle = this.countAngleByCords(centerX, centerY, e.clientX, e.clientY, arctangent);

    const isInnerClockChosen = this.isInnerClockFace(centerX, centerY, e.clientX, e.clientY);

    const angleStep = this.unit === TimeUnit.MINUTE ? (6 * (this.minutesGap || 1)) : 30;
    const roundedAngle = this.roundAngle(circleAngle, angleStep);
    const angle = (roundedAngle || 360) + (isInnerClockChosen ? 360 : 0);

    const selectedTime = this.faceTime.find(val => val.angle === angle);
    this.selectedTime = selectedTime;
    this.setClockHandPosition();

    if (selectedTime && !selectedTime.disabled) {
      this.timeChange.next(selectedTime);

      if (!this.isStarted) {
        this.timeSelected.next(selectedTime);
      }
    }

  }

  @HostListener('mouseup', ['$event'])
  onMouseup(e: any) {
    e.preventDefault();
    this.isStarted = false;
  }

  private selectAvailableTime(): void {
    const currentTime = this.faceTime.find(time => this.selectedTime.time === time.time);
    this.isClockFaceDisabled = this.faceTime.every(time => time.disabled);

    if ((currentTime && currentTime.disabled) && !this.isClockFaceDisabled) {
      const availableTime = this.faceTime.find(time => !time.disabled);

      this.timeChange.next(availableTime);
    }
  }

  private isInnerClockFace(x0: number, y0: number, x: number, y: number): boolean {
    return Math.sqrt(Math.pow(x - x0, 2) + Math.pow(y - y0, 2)) < this.innerClockFaceSize;
  }

  private addTouchEvents(): void {
    this.touchStartHandler = this.onMousedown.bind(this);
    this.touchEndHandler = this.onMouseup.bind(this);

    this.clockFace.nativeElement.addEventListener('touchstart', this.touchStartHandler);
    this.clockFace.nativeElement.addEventListener('touchend', this.touchEndHandler);
  }

  private removeTouchEvents(): void {
    this.clockFace.nativeElement.removeEventListener('touchstart', this.touchStartHandler);
    this.clockFace.nativeElement.removeEventListener('touchend', this.touchEndHandler);
  }

  roundAngle(angle: number, step: number): number {
    return Math.round(angle / step) * step;
  }

  countAngleByCords(x0: number, y0: number, x: number, y: number, currentAngle: number): number {
    if (y > y0 && x >= x0) {
      return 180 - currentAngle;
    } else if (y > y0 && x < x0) {
      return 180 + currentAngle;
    } else if (y < y0 && x < x0) {
      return 360 - currentAngle;
    } else {
      return currentAngle;
    }
  }

  ngOnDestroy() {
    this.removeTouchEvents();
  }

}


