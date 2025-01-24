import { afterNextRender, Directive, ElementRef, inject, forwardRef, output } from '@angular/core';
import { GeocoderAutocomplete } from "@geoapify/geocoder-autocomplete";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { SearchResult } from '../../interfaces/search-result';

@Directive({
  selector: 'ga-autocomplete',
  host: {
    'style': `
      z-index: 1;
      display: block;
      position: absolute;
      top: 20px;
      right: 20px;
      width: 50%;
      background-color: white;
    `
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GaAutocompleteDirective),
      multi: true
    }
  ]
})
export class GaAutocompleteDirective implements ControlValueAccessor {
  #elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  #autoComplete!: GeocoderAutocomplete;

locationChange = output<SearchResult>();

  private onChange?: (value: SearchResult | null) => void;
  private onTouched?: () => void;

  constructor() {
    afterNextRender(() => {
      this.#autoComplete = new GeocoderAutocomplete(
        this.#elementRef.nativeElement,
        "42c7710f83bc41698b841fec7a3b5d2d",
        { lang: "es", debounceDelay: 600 }
      );

      this.#autoComplete.on("select", (location) => {
        const result: SearchResult = {
          coordinates: location.geometry.coordinates,
          address: location.properties.formatted
        };

        this.locationChange.emit(result);

        this.onChange?.(result);
      });
    });
  }

  writeValue(value: SearchResult | null): void {
    if (!this.#autoComplete) {
      Promise.resolve().then(() => this.writeValue(value));
      return;
    }

    this.#autoComplete.setValue(value?.address || '');
  }

  registerOnChange(fn: (value: SearchResult | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.#elementRef.nativeElement.style.pointerEvents = isDisabled ? 'none' : 'auto';
  }
}
