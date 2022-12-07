import { Component, Input, ViewChild } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject, take, takeUntil } from 'rxjs';
import { UntypedFormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';

export interface MultiselectItem {
  id: string;
  name: string;
}


@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss']
})
export class MultiSelectComponent {

  @Input() availableItemsInput!: BehaviorSubject<MultiselectItem[]>;
  @Input() placeholder?: string;
  @Input() showSelectedValues = false;
  availableItems: MultiselectItem[] = [];

  /** control for the selected car */
  public itemCtrl: UntypedFormControl = new UntypedFormControl();

  /** control for the MatSelect filter keyword */
  public itemFilterCtrl: UntypedFormControl = new UntypedFormControl();

  /** list of cars filtered by search keyword */
  public filteredItems: ReplaySubject<MultiselectItem[]> = new ReplaySubject<MultiselectItem[]>(1);

  @ViewChild('singleSelect', {static: true})
  singleSelect!: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  /** flags to set the toggle all checkbox state */
  isIndeterminate = false;
  isChecked = false;

  constructor() {
  }

  ngOnInit() {
    // // set initial selection
    // this.carCtrl.setValue([this.cars[1], this.cars[2]]);

    this.availableItemsInput
      .pipe(takeUntil(this._onDestroy))
      .subscribe((items) => {
        this.availableItems = items;
        // load the initial car list
        this.filteredItems.next(this.availableItems.slice());
      });


    // listen for search field value changes
    this.itemFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterItems();
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
    this.filteredItems
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: MultiselectItem, b: MultiselectItem) =>
          a && b && a.id === b.id;
      });
  }

  protected filterItems() {
    if (!this.availableItems) {
      return;
    }
    // get the search keyword
    let search = this.itemFilterCtrl.value;
    if (!search) {
      this.filteredItems.next(this.availableItems.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the cars
    this.filteredItems.next(
      this.availableItems.filter((car) => car.name.toLowerCase().indexOf(search) > -1)
    );
  }

  toggleSelectAll(selectAllValue: boolean) {
    this.filteredItems
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((val) => {
        if (selectAllValue) {
          this.itemCtrl.patchValue(val);
        } else {
          this.itemCtrl.patchValue([]);
        }
      });
  }

}
