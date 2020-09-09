import { FormControl } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { ItemTemplateComponent } from 'ng-eventstore-listing';

@Component({
  selector: 'app-test',
  templateUrl: './test-row.component.html',
  styleUrls: ['./test-row.component.css']
})
export class TestRowComponent extends ItemTemplateComponent implements OnInit {
  titleStatusFormControl: FormControl;

  constructor(changeDetectorRef: ChangeDetectorRef) {
    super(changeDetectorRef);
  }

  ngOnInit(): void {
    // Bind onChanges
    this.registerChangeFunction(this.onChanges);

    this.titleStatusFormControl = this.createFormControl('titleStatus', this.data.get('data').get('titleStatus'), null);

  }

  onChanges(changes: SimpleChanges) {
    console.log(changes);
  }

  testGetLookups() {
    this.onGetLookups('test', (payload) => {
      console.log(payload);
    });
  }

}
