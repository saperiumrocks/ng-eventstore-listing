import { Component, OnInit, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { ItemTemplateComponent } from 'projects/ng-eventstore-listing/src/lib/components/template-components';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent extends ItemTemplateComponent implements OnInit {
  constructor(changeDetectorRef: ChangeDetectorRef) {
    super(changeDetectorRef);
  }

  ngOnInit(): void {
    // Bind onChanges
    this.registerChangeFunction(this.onChanges);
  }

  onChanges(changes: SimpleChanges) { }

}
