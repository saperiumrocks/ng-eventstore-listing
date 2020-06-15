import { Component, OnInit, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { ItemTemplateComponent } from 'projects/ng-eventstore-listing/src/lib/components/template-components';

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
