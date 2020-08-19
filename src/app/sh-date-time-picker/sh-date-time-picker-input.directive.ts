import { Directive, forwardRef, InjectionToken, OnDestroy, Input, ElementRef, Optional, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, Validator, AbstractControl, ValidationErrors } from '@angular/forms';
import { ShDateTimePicker } from './sh-date-time-picker.component';
import { Subscription } from 'rxjs';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { MatFormField } from '@angular/material/form-field';
import { DOWN_ARROW } from '@angular/cdk/keycodes';
import { DatePipe } from '@angular/common';


export const SH_DATEPICKER_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ShDateTimePickerInput),
  multi: true
};

export const SH_DATEPICKER_VALIDATORS: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => ShDateTimePickerInput),
  multi: true
};

export const SH_INPUT_VALUE_ACCESSOR =
  new InjectionToken<{ value: any }>('SH_INPUT_VALUE_ACCESSOR');

@Directive({
  selector: 'input[shDateTimePicker]',
  providers: [
    SH_DATEPICKER_VALUE_ACCESSOR,
    SH_DATEPICKER_VALIDATORS,
    { provide: SH_INPUT_VALUE_ACCESSOR, useExisting: ShDateTimePickerInput },
  ],
  exportAs: 'shDateTimepickerInput',
})
export class ShDateTimePickerInput <D> implements ControlValueAccessor, OnDestroy, Validator {
  @Input()
  set shDateTimePicker(value: ShDateTimePicker<D>) {
    if (!value) {
      return;
    }

    this._datepicker = value;
    this._datepicker._registerInput(this);
    this._datepickerSubscription.unsubscribe();

    this._datepickerSubscription = this._datepicker._selectedChanged.subscribe((selected) => {
      this.value = selected;
      this._cvaOnChange(selected);
      this._onTouched();
    });
  }

  _datepicker: ShDateTimePicker<D>;
  private _datepickerSubscription = Subscription.EMPTY;

  @Input()
  get value(): any | null { return this._value; }
  set value(value: any | null) {
    this._value = value;
    this._formatValue(value);
  }
  _value: D | null;

  @Input()
  get disabled(): boolean { return !!this._disabled; }
  set disabled(value: boolean) {
    const newValue = coerceBooleanProperty(value);
    const element = this._elementRef.nativeElement;

    if (this._disabled !== newValue) {
      this._disabled = newValue;
      // this._disabledChange.emit(newValue);
    }

    if (newValue && element.blur) {
      element.blur();
    }
  }
  private _disabled: boolean;

  constructor(
    private _elementRef: ElementRef<HTMLInputElement>,
    @Optional() private _formField: MatFormField
  ) {

  }

  @HostListener('focus', ['$event'])
  _onKeydown(event: KeyboardEvent) {
    if (this._datepicker) {
      this._datepicker.open();
      event.preventDefault();
    }
  }

  @HostListener('blur')
  _onBlur() {
    if (this.value) {
      this._formatValue(this.value);
    }

    this._onTouched();
  }

  // Open the picker when user hold alt + DOWN_ARROW
  @HostListener('keydown', ['$event'])
  _onKeyDown(event: KeyboardEvent) {
    if (event.altKey && event.keyCode === DOWN_ARROW) {
      this._datepicker.open();
      event.preventDefault();
    }
  }

  _onTouched = () => { };
  private _cvaOnChange: (value: any) => void = () => { };

  // Implemented as part of ControlValueAccessor.
  writeValue(value: D): void {
    this.value = value;
  }

  // Implemented as part of ControlValueAccessor.
  registerOnChange(fn: (value: any) => void): void {
    this._cvaOnChange = fn;
  }

  // Implemented as part of ControlValueAccessor.
  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  validate(c: AbstractControl): ValidationErrors | null {
    return null;
  }

  getConnectedOverlayOrigin(): ElementRef {
    return this._formField ? this._formField.getConnectedOverlayOrigin() : this._elementRef;
  }

  private _formatValue(value: any | null) {
    setTimeout(() => {
      if (this.value) {
        if (this._datepicker.getPickerType() === 'time') {
          this._elementRef.nativeElement.value = value;
        } else {
          const selectedDate = new Date(value);

          if (selectedDate) {
            const pipe = new DatePipe('en-US');
            let dateFormatted;

            if (this._datepicker.getPickerType() === 'date') {
              dateFormatted = pipe.transform(selectedDate, 'MM/dd/yyyy');
            } else {
              dateFormatted = pipe.transform(selectedDate, 'MM/dd/yyyy, HH:mm:ss');
            }
            this._elementRef.nativeElement.value = dateFormatted;
          } else {
            this._elementRef.nativeElement.value = value;
          }
        }
      } else {
        this._elementRef.nativeElement.value = value;
      }
    });
  }

  ngOnDestroy() {
    this._datepickerSubscription.unsubscribe();
  }

}

