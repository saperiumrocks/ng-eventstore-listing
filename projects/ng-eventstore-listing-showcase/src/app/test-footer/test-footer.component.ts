import { Component, OnInit, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { HeaderFooterTemplateComponent } from '../../../../ng-eventstore-listing/src/lib/components/template-components';

@Component({
  selector: 'app-test',
  templateUrl: './test-footer.component.html',
  styleUrls: ['./test-footer.component.css']
})
export class TestFooterComponent extends HeaderFooterTemplateComponent implements OnInit {
  cdr: ChangeDetectorRef;
  constructor(changeDetectorRef: ChangeDetectorRef) {
    super(changeDetectorRef);
    this.cdr = changeDetectorRef;
  }

  pagesArray = [];
  numberOfPages: number;

  ngOnInit(): void {
    this.pagesArray = [];
    this.numberOfPages = Math.ceil(this.totalItemCount / this.itemsPerPage);
    for (let i = 0; i < this.numberOfPages; i++) {
      this.pagesArray.push(i + 1);
    }

    this.cdr.detectChanges();
  }

  onPage(page) {
    this.onPageChanged(page);
  }

}
