import { Component, ViewChild } from '@angular/core';
import { ReplaySubject, Subject, take, takeUntil } from 'rxjs';
import { UntypedFormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';

export interface Car {
  id: string;
  name: string;
}

/** list of cars */
export const CARS: Car[] = [
  { name: 'Mercedes-Benz', id: 'A' },
  { name: 'Tesla', id: 'B' },
  { name: 'BMW', id: 'C' },
  { name: '	Volvo', id: 'D' },
];


@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss']
})
export class MultiSelectComponent {

  protected cars: Car[] = CARS;

  /** control for the selected car */
  public carCtrl: UntypedFormControl = new UntypedFormControl();

  /** control for the MatSelect filter keyword */
  public carFilterCtrl: UntypedFormControl = new UntypedFormControl();

  /** list of cars filtered by search keyword */
  public filteredCars: ReplaySubject<Car[]> = new ReplaySubject<Car[]>(1);

  @ViewChild('singleSelect', { static: true })
  singleSelect!: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  /** flags to set the toggle all checkbox state */
  isIndeterminate = false;
  isChecked = false;

  constructor() {}

  ngOnInit() {
    // set initial selection
    this.carCtrl.setValue([this.cars[1], this.cars[2]]);

    // load the initial car list
    this.filteredCars.next(this.cars.slice());

    // listen for search field value changes
    this.carFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCars();
      });
  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  /**
   * Sets the initial value after the filteredCars are loaded initially
   */
  protected setInitialValue() {
    this.filteredCars
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: Car, b: Car) =>
          a && b && a.id === b.id;
      });
  }

  protected filterCars() {
    if (!this.cars) {
      return;
    }
    // get the search keyword
    let search = this.carFilterCtrl.value;
    if (!search) {
      this.filteredCars.next(this.cars.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the cars
    this.filteredCars.next(
      this.cars.filter((car) => car.name.toLowerCase().indexOf(search) > -1)
    );
  }

  toggleSelectAll(selectAllValue: boolean) {
    this.filteredCars
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((val) => {
        if (selectAllValue) {
          this.carCtrl.patchValue(val);
        } else {
          this.carCtrl.patchValue([]);
        }
      });
  }

}
