import { Component, OnInit, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { ItemTemplateComponent } from 'ng-eventstore-listing';

@Component({
  selector: 'app-test',
  templateUrl: './test-row.component.html',
  styleUrls: ['./test-row.component.css']
})
export class TestRowComponent extends ItemTemplateComponent implements OnInit {
  constructor(changeDetectorRef: ChangeDetectorRef) {
    super(changeDetectorRef);
  }

  ngOnInit(): void {
    // Bind onChanges
    this.registerChangeFunction(this.onChanges);
  }

  onChanges(changes: SimpleChanges) { }

}
