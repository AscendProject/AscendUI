import { Component, Input, forwardRef, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SwitchComponent),
      multi: true
    }
  ]
})
export class SwitchComponent implements ControlValueAccessor {
  @Input() label = 'switch';
  @Input('value') _value = false;
  onChange: any = () => { };
  onTouched: any = () => { };

  get value() {

    return this._value;
  }
  @Output() valueget = new EventEmitter<boolean>();

  set value(val) {

    this._value = val;
    this.onChange(val);
    this.onTouched();
  }

  constructor() { }

  registerOnChange(fn) {

    this.onChange = fn;
  }

  writeValue(value) {


    this.value = value;

  }

  registerOnTouched(fn) {
    ;
    this.onTouched = fn;
  }

  switch() {

    this.value = !this.value;
    this.valueget.emit(this.value);
  }
}

