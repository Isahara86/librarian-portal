import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject, take, takeUntil } from 'rxjs';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

export interface MultiselectItem {
  id: string;
  name: string;
}

export interface MultiselectInitialState {
  available: MultiselectItem[];
  selected: MultiselectItem[];
}

@Component({
  standalone: true,
  selector: 'app-multi-select',
  template: `
    <div class="wrapper">
      <div class="inner-wrap">
        <mat-form-field style="width: 100%;">
          <mat-select
            [formControl]="itemCtrl"
            (valueChange)="valueUpdated.emit($event)"
            placeholder="{{ placeholder }}"
            [multiple]="true"
            #singleSelect
          >
            <mat-option>
              <ngx-mat-select-search
                [formControl]="itemFilterCtrl"
                placeholderLabel="Find {{ placeholder }}..."
                noEntriesFoundLabel="'no matching found'"
                [showToggleAllCheckbox]="checkIfShowCreateButton(filteredItems | async)"
                toggleAllCheckboxTooltipMessage="Select / Unselect All"
                [toggleAllCheckboxIndeterminate]="isIndeterminate"
                [toggleAllCheckboxChecked]="isChecked"
                (toggleAll)="onCreate()"
              >
                <mat-icon ngxMatSelectSearchClear>delete</mat-icon>
              </ngx-mat-select-search>
            </mat-option>

            <mat-option *ngFor="let selectItem of filteredItems | async" [value]="selectItem">
              {{ selectItem.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </div>
      <div *ngIf="showSelectedValues" class="inner-wrap">
        <h3>Selected Values</h3>
        <ul *ngFor="let item of itemCtrl?.value">
          <li>{{ item.name }}</li>
        </ul>
      </div>
    </div>
  `,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    NgxMatSelectSearchModule,
    MatIconModule,
    CommonModule,
  ],
})
export class MultiSelectComponent implements OnInit, AfterViewInit, OnDestroy {
  @Output() valueUpdated = new EventEmitter<MultiselectItem[]>();
  @Input() initialState$!: BehaviorSubject<MultiselectInitialState>;
  @Input() placeholder?: string;
  @Input() showSelectedValues = false;
  @Input() createResource?: (name: string) => Promise<void>;
  availableItems: MultiselectItem[] = [];

  /** control for the selected car */
  public itemCtrl: UntypedFormControl = new UntypedFormControl();

  /** control for the MatSelect filter keyword */
  public itemFilterCtrl: UntypedFormControl = new UntypedFormControl();

  /** list of cars filtered by search keyword */
  public filteredItems: ReplaySubject<MultiselectItem[]> = new ReplaySubject<MultiselectItem[]>(1);

  @ViewChild('singleSelect', { static: true })
  singleSelect!: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  /** flags to set the toggle all checkbox state */
  isIndeterminate = false;
  isChecked = false;

  ngOnInit() {
    // // set initial selection
    // this.carCtrl.setValue([this.cars[1], this.cars[2]]);

    this.initialState$.pipe(takeUntil(this._onDestroy)).subscribe(({ available, selected }) => {
      this.availableItems = available;
      this.itemCtrl.patchValue(selected);
      // load the initial list
      this.filteredItems.next(this.availableItems.slice());
    });

    // listen for search field value changes
    this.itemFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
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
    this.filteredItems.pipe(take(1), takeUntil(this._onDestroy)).subscribe(() => {
      this.singleSelect.compareWith = (a: MultiselectItem, b: MultiselectItem) =>
        a && b && a.id === b.id;
    });
  }

  protected filterItems() {
    if (!this.availableItems) {
      return;
    }
    // get the search keyword
    let search = this.itemFilterCtrl.value?.trim();
    if (!search) {
      this.filteredItems.next(this.availableItems.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the cars
    this.filteredItems.next(
      this.availableItems.filter(car => car.name.toLowerCase().indexOf(search) > -1),
    );
  }

  onCreate() {
    const search = this.itemFilterCtrl.value;
    if (this.createResource && search) {
      this.createResource(search).then(() => this.filterItems());
    }
  }

  // toggleSelectAll(selectAllValue: boolean) {
  //   this.filteredItems
  //     .pipe(take(1), takeUntil(this._onDestroy))
  //     .subscribe((val) => {
  //       if (selectAllValue) {
  //         this.itemCtrl.patchValue(val);
  //       } else {
  //         this.itemCtrl.patchValue([]);
  //       }
  //     });
  // }

  checkIfShowCreateButton(values: MultiselectItem[] | undefined | null): boolean {
    const searchValue = this.itemFilterCtrl.value?.trim();
    if (!this.createResource || !values || !searchValue) {
      return false;
    }

    const hasSameAuthor = values.some(mi => mi.name === searchValue);

    return !hasSameAuthor;
  }
}
