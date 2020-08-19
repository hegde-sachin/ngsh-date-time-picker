import { Component, OnDestroy, Input, Output, EventEmitter, ViewContainerRef, Injector, Optional, Inject } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { OverlayRef, Overlay, ScrollStrategyOptions, OverlayConfig } from '@angular/cdk/overlay';
import { Subject, merge } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { ESCAPE, UP_ARROW } from '@angular/cdk/keycodes';
import { ShDateTimePickerInput } from './sh-date-time-picker-input.directive';
import { ShDateTimePickerOverlayComponent } from './sh-date-time-picker-overlay/sh-date-time-picker-overlay.component';
import { SH_DATE_TIME_PICKER_OVERLAY_DATA } from './sh-date-time-picker-overlay/sh-date-time-picker-overlay-data';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'sh-date-time-picker',
  template: '',
  exportAs: '[shDateTimePicker]'
})
export class ShDateTimePicker <D> implements OnDestroy {
  @Input()
  get timeFormat() {
    return this._timeFormat;
  }
  set timeFormat(timeFormat) {
    this._timeFormat = timeFormat;
  }
  private _timeFormat = 24;

  @Input()
  get pickerType() {
    return this._pickerType;
  }
  set pickerType(pickerType) {
    this._pickerType = pickerType ? pickerType : 'default';
  }
  private _pickerType = 'default';

  getPickerType() {
    return this._pickerType;
  }

  @Input()
  get disabled(): boolean {
    return this._disabled === undefined && this._dateTimePickerInput ?
      this._dateTimePickerInput.disabled : !!this._disabled;
  }
  set disabled(value: boolean) {
    const newValue = coerceBooleanProperty(value);

    if (newValue !== this._disabled) {
      this._disabled = newValue;
    }
  }
  private _disabled: boolean;

  @Input()
  get opened(): boolean { return this._opened; }
  set opened(value: boolean) { value ? this.open() : this.closeOverlay(); }
  private _opened = false;

  @Input()
  get pickerMode() {
    return this._pickerMode;
  }

  set pickerMode(mode) {
    if (mode === 'dialog') {
      this._pickerMode = mode;
    } else {
      this._pickerMode = 'overlay';
    }
  }
  private _pickerMode = 'overlay';

  @Output() dateTimeSelection = new EventEmitter();

  _dateTimePickerInput: ShDateTimePickerInput<any>;

  private dateTimePickerOverlayRef: OverlayRef;

  readonly _selectedChanged = new Subject<D>();

  private _focusedElementBeforeOpen: HTMLElement | null = null;

  private isSmallScreen = false;

  constructor(
    private overlay: Overlay,
    private scrollStrategyOptions: ScrollStrategyOptions,
    private viewContainerRef: ViewContainerRef,
    private injector: Injector,
    @Optional() @Inject(DOCUMENT) private _document: any,
    private breakpointObserver: BreakpointObserver
  ) {
    this.breakpointObserver.observe([
      Breakpoints.Web,
      Breakpoints.Tablet,
      Breakpoints.Handset
    ]).subscribe(() => {
      this.isSmallScreen = breakpointObserver.isMatched('(max-width: 767px)');
    });
  }

  _registerInput(input: ShDateTimePickerInput<D>): void {
    if (this._dateTimePickerInput) {
      throw Error('A Date Time Picker can only be associated with a single input.');
    }
    this._dateTimePickerInput = input;
  }

  open(): void {
    if (this._opened || this.disabled) {
      return;
    }

    if (this._document) {
      this._focusedElementBeforeOpen = this._document.activeElement;
      this._focusedElementBeforeOpen.blur();
    }

    if (this.isSmallScreen) {
      this._pickerMode === 'overlay' ? this._openAsOverlay() : this._openAsDialog();
    } else {
      this._pickerMode === 'dialog' ? this._openAsDialog() : this._openAsOverlay();
    }
    this._opened = true;
  }

  _openAsOverlay() {
    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(this._dateTimePickerInput.getConnectedOverlayOrigin())
      .withFlexibleDimensions(false)
      .withViewportMargin(8)
      .withLockedPosition()
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top'
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom'
        },
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top'
        },
        {
          originX: 'end',
          originY: 'top',
          overlayX: 'end',
          overlayY: 'bottom'
        }
      ]);

    const overlayConfig = new OverlayConfig({
      positionStrategy,
      hasBackdrop: true,
      backdropClass: 'mat-overlay-transparent-backdrop',
      scrollStrategy: this.scrollStrategyOptions.reposition(),
      width: '300px',
      maxHeight: '500px'
    });

    this.createOverlay(overlayConfig);
  }

  _openAsDialog() {
    const positionStrategy = this.overlay.position().global()
      .centerHorizontally().centerVertically();

    const config = new OverlayConfig({
      positionStrategy,
      scrollStrategy: this.scrollStrategyOptions.block(),
      hasBackdrop: true,
      width: '300px',
      maxHeight: '500px'
    });

    this.createOverlay(config);
  }

  createOverlay(config) {
    this.dateTimePickerOverlayRef = this.overlay.create(config);

    const injector = this.createInjector();

    const ticketDetailsPortal = new ComponentPortal(ShDateTimePickerOverlayComponent, this.viewContainerRef, injector);
    this.dateTimePickerOverlayRef.attach(ticketDetailsPortal);

    merge(
      this.dateTimePickerOverlayRef.backdropClick(),
      this.dateTimePickerOverlayRef.detachments(),
      this.dateTimePickerOverlayRef.keydownEvents().pipe(filter((event: any) => {
        return event.keyCode === ESCAPE ||
          (this._dateTimePickerInput && event.altKey && event.keyCode === UP_ARROW);
      }))
    ).subscribe((event: any) => {
      if (event) {
        event.preventDefault();
      }

      this.closeOverlay();
    });
  }

  createInjector(): PortalInjector {
    const injectionTokens = new WeakMap();

    injectionTokens.set(SH_DATE_TIME_PICKER_OVERLAY_DATA, {
      dateTimeValue: this._dateTimePickerInput._value,
      timeFormat: this._timeFormat,
      pickerType: this._pickerType,
      cancelDateTimePicker: () => {
        this.closeOverlay();
      },
      selectDateTimePicker: (event) => {
        this._selectedChanged.next(event);
        this.dateTimeSelection.emit(event);
        this.closeOverlay();
      }
    });

    return new PortalInjector(this.injector, injectionTokens);
  }

  closeOverlay() {
    if (!this._opened) {
      return;
    }

    if (this.dateTimePickerOverlayRef) {
      this.dateTimePickerOverlayRef.detach();
      this.dateTimePickerOverlayRef.dispose();
    }

    const completeClose = () => {
      if (this._opened) {
        this._opened = false;
        this._focusedElementBeforeOpen.blur();
        this._focusedElementBeforeOpen = null;
      }
    };

    if (this._focusedElementBeforeOpen &&
      typeof this._focusedElementBeforeOpen.focus === 'function') {
      this._focusedElementBeforeOpen.focus();
      setTimeout(completeClose);
    } else {
      completeClose();
    }
  }

  ngOnDestroy() {
  }

}

