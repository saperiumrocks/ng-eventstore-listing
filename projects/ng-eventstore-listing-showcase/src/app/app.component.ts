import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { TestComponent } from './test/test.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  data: SampleRowType[];
  rowComponentClass = TestComponent;
  idPropertyName = 'vehicleId';

  ngOnInit() {
    this.data = [
      { vehicleId: '1', vehicleDescription: '2011 Toyota Vios', photoUrl: 'assets/images/1.jpeg', soldAmount: 12500, soldAt: 1591844802852 },
      { vehicleId: '2', vehicleDescription: '2009 Mitsubishi Lancer', photoUrl: 'assets/images/2.jpeg', soldAmount: 3200, soldAt: 1591844802852 },
      { vehicleId: '3', vehicleDescription: '2016 Honda Civic', photoUrl: 'assets/images/3.jpeg', soldAmount: 1250, soldAt: 1591844802852 },
      { vehicleId: '4', vehicleDescription: '2001 Mini Cooper', photoUrl: 'assets/images/4.jpeg', soldAmount: 6700, soldAt: 1591844802852 }
    ];
  }
}


export interface SampleRowType {
  vehicleId: string;
  photoUrl: string;
  vehicleDescription: string;
  soldAmount: number;
  soldAt: number;
}
