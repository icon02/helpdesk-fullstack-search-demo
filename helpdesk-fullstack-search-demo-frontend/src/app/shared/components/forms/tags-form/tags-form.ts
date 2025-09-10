import {booleanAttribute, Component, forwardRef, HostListener, Input, input, output, signal} from '@angular/core';
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from '@angular/forms';
import {TagFormValue} from '../../../model/tag-form-value';

@Component({
  selector: 'app-tags-form',
  imports: [
    FormsModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TagsForm),
      multi: true
    }
  ],
  templateUrl: './tags-form.html',
  styleUrl: './tags-form.css'
})
export class TagsForm implements ControlValueAccessor {
  $readonly = input(false, {alias: 'readonly', transform: booleanAttribute})

  @Input()
  set value(value: TagFormValue[]) {
    this.$value.set(value);
  }

  valueChange = output<TagFormValue[]>();

  protected $value = signal<TagFormValue[]>([]);
  protected $isDisabled = signal<boolean>(false);

  protected $inputString = signal<string>('');

  private onChangeFn?: (val: TagFormValue[]) => void;
  private onTouchedFn?: () => void;
  private hasBeenTouched: boolean = false;


  addTag(event: Event) {
    event.preventDefault();

    this.$value.update(cur => {
      const inputStr = this.$inputString().trim();
      if (!inputStr || cur.find(tag => tag.name === this.$inputString())) {
        return cur;
      } else {
        return [...cur, {name: this.$inputString()}]
      }
    });

    this.$inputString.set('');
  }

  deleteTag(name: string) {
    if(!this.$readonly() && !this.$isDisabled()) {
      this.$value.update(cur => {
        const idx = cur.findIndex(tag => tag.name === name);
        const newArr = [...cur];
        newArr.splice(idx, 1);

        return newArr;
      })

      this.valueChange.emit(this.$value());
      this.onChangeFn?.(this.$value());
    }
  }

  @HostListener('click')
  @HostListener('keydown')
  touch() {
    if (!this.hasBeenTouched && !this.$isDisabled()) {
      this.onTouchedFn?.();
      this.hasBeenTouched = true;
    }
  }

  writeValue(obj: any): void {
    if (Array.isArray(obj)) {
      if (obj.length && !obj[0].name) {
        throw new Error('param must be of type TagsFormValue[]');
      }

      this.$value.set(obj);
    } else {
      throw new Error('param must be of type TagsFormValue[]');
    }
  }

  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.$isDisabled.set(isDisabled);
  }
}
