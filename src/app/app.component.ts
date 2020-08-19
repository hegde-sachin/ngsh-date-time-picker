import { Component, OnInit } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

declare const tinycolor: any;

export interface Color {
  name: string;
  hex: string;
  darkContrast: boolean;
}

@Component({
  selector: 'sh-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  public colorPalettes = [
    {
      name: 'My Color : Teal and Gold',
      primary: '#118899',
      accent: '#FFD700'
    },
    {
      name: 'Deep Purple and Amber',
      primary: '#673ab7',
      accent: '#ffd740'
    },
    {
      name: 'Indigo & Pink',
      primary: '#3f51b5',
      accent: '#ff4081'
    },
    {
      name: 'Pink & Blue-grey',
      primary: '#e91e63',
      accent: '#ff4081'
    },
    {
      name: 'Purple & Green',
      primary: '#9c27b0',
      accent: '#69f0ae'
    }
  ];

  private isLightTheme = true;

  public dateTimeControl = new FormControl('');
  public preselectedDateTimeControl = new FormControl('05/30/2004 15:45');
  public pickerType = new FormControl('');
  public timeFormat = new FormControl('');
  public pickerMode = new FormControl('');
  public isRequired = false;
  public isDisabled = false;

  public inlinePickerType = new FormControl('');
  public inlinePickerTimeFormat = new FormControl('');
  public inlineDateTimePickerValue;

  public componentPropertyList = [
    {
      propertyName: 'pickerType',
      defaultValue: '"default" (Both Date and Time picker)',
      description: `Type of picker. Available values: "default", "date" (only date picker), "time" (only time picker)`
    },
    {
      propertyName: 'timeFormat',
      defaultValue: '24',
      description: 'Works when timepicker is available. Available values: 24, 12'
    },
    {
      propertyName: 'pickerMode',
      defaultValue: '"overlay"',
      description: 'Works when datetimepicker is attached to input. Available values: "overlay", "dialog"'
    },
    {
      propertyName: 'pickerReturnValueFormat',
      defaultValue: '"date"',
      description: 'Type of date time picker return value format. Available values: "date", "timestamp"'
    }
  ];

  public componentMethodList = [
    {
      methodName: 'dateTimeSelection',
      methodParameters: '',
      description: 'Output event to capture the selected date and time value from picker component'
    }
  ];

  componentPropertiesdisplayedColumns: string[] = ['className', 'defaultValue', 'description'];
  componentPropertiesDataSource = new MatTableDataSource();

  componentMethodsdisplayedColumns: string[] = ['className', 'methodParameters', 'description'];
  componentMethodsDataSource = new MatTableDataSource();

  usage = `
<mat-form-field appearance="outline">
  <mat-label>Choose a date</mat-label>
  <input matInput [shDateTimePicker]="shDateTimePicker" [formControl]="dateTimeControl" autocomplete="off">
  <sh-date-time-picker #shDateTimePicker></sh-date-time-picker>
</mat-form-field>`;

  constructor(private overlayContainer: OverlayContainer) {

  }

  ngOnInit() {
    this.setColor(this.colorPalettes[0].primary, this.colorPalettes[0].accent)
    this.assignThemeClasses();
    this.componentPropertiesDataSource.data = this.componentPropertyList;
    this.componentMethodsDataSource.data = this.componentMethodList;
  }

  setColor(primary, accent) {
    this.savePrimaryColor(primary);
    this.saveSecondaryColor(accent);
  }

  savePrimaryColor(primaryColor) {
    const primaryColorPalette = this.computeColors(primaryColor);

    for (const color of primaryColorPalette) {
      const key1 = `--theme-primary-${color.name}`;
      const value1 = color.hex;
      const key2 = `--theme-primary-contrast-${color.name}`;
      const value2 = color.darkContrast ? 'rgba(black, 0.87)' : 'white';
      document.documentElement.style.setProperty(key1, value1);
      document.documentElement.style.setProperty(key2, value2);
    }
  }

  saveSecondaryColor(secondaryColor) {
    const secondaryColorPalette = this.computeColors(secondaryColor);

    for (const color of secondaryColorPalette) {
      const key1 = `--theme-secondary-${color.name}`;
      const value1 = color.hex;
      const key2 = `--theme-secondary-contrast-${color.name}`;
      const value2 = color.darkContrast ? 'rgba(black, 0.87)' : 'white';
      document.documentElement.style.setProperty(key1, value1);
      document.documentElement.style.setProperty(key2, value2);
    }
  }

  toggleDarkTheme() {
    this.isLightTheme = !this.isLightTheme;

    this.assignThemeClasses();
  }

  assignThemeClasses() {
    const overlayContainerClasses = this.overlayContainer.getContainerElement().classList;

    if (this.isLightTheme) {
      document.body.classList.remove('sh-dark-theme');
      overlayContainerClasses.remove('sh-dark-theme');
      document.body.classList.add('sh-light-theme');
      overlayContainerClasses.add('sh-light-theme');
    } else {
      document.body.classList.remove('sh-light-theme');
      overlayContainerClasses.remove('sh-light-theme');
      document.body.classList.add('sh-dark-theme');
      overlayContainerClasses.add('sh-dark-theme');
    }
  }

  computeColors(hex: string): Color[] {
    return [
      this.getColorObject(tinycolor(hex).lighten(52), '50'),
      this.getColorObject(tinycolor(hex).lighten(37), '100'),
      this.getColorObject(tinycolor(hex).lighten(26), '200'),
      this.getColorObject(tinycolor(hex).lighten(12), '300'),
      this.getColorObject(tinycolor(hex).lighten(6), '400'),
      this.getColorObject(tinycolor(hex), '500'),
      this.getColorObject(tinycolor(hex).darken(6), '600'),
      this.getColorObject(tinycolor(hex).darken(12), '700'),
      this.getColorObject(tinycolor(hex).darken(18), '800'),
      this.getColorObject(tinycolor(hex).darken(24), '900'),
      this.getColorObject(tinycolor(hex).lighten(50).saturate(30), 'A100'),
      this.getColorObject(tinycolor(hex).lighten(30).saturate(30), 'A200'),
      this.getColorObject(tinycolor(hex).lighten(10).saturate(15), 'A400'),
      this.getColorObject(tinycolor(hex).lighten(5).saturate(5), 'A700')
    ];
  }

  getColorObject(value, name): Color {
    const c = tinycolor(value);
    return {
      name,
      hex: c.toHexString(),
      darkContrast: c.isLight()
    };
  }

  clear() {
    this.dateTimeControl.setValue('');
  }

  onDateTimeSelection(date) {
    this.inlineDateTimePickerValue = date;
  }

  pickerTypeChange() {
    this.dateTimeControl.setValue('');
  }

  togglePickerDisableState() {
    if (this.dateTimeControl.disabled) {
      this.dateTimeControl.enable();
    } else {
      this.dateTimeControl.disable();
    }

    this.isDisabled = !this.isDisabled;
  }

  togglePickerRequiredState() {
    if (this.isRequired) {
      this.dateTimeControl = new FormControl(this.dateTimeControl.value, [Validators.required]);
    } else {
      this.dateTimeControl = new FormControl(this.dateTimeControl.value);
    }

    this.isDisabled ? this.dateTimeControl.disable() : this.dateTimeControl.enable();
    this.isRequired = !this.isRequired;
  }
}
