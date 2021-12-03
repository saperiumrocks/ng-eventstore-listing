import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { NgEventstoreListingComponent } from './ng-eventstore-listing.component';
import { ItemTemplateHolderComponent } from './components/item-template-holder/item-template-holder.component';
import { CommonModule } from '@angular/common';
import { TemplateDirective } from './directives/template.directive';
// import { IO_TOKEN, SocketIoService } from './services/socket.io.service';
// import * as io from 'socket.io-client';
import { ScriptService } from './services/script.service';
import { PlaybackService } from './services/playback.service';
import { PlaybackListService } from './services/playback-list.service';
import { PushService } from './services/push.service';
import { SocketIoService } from './services/socket.io.service';
import { jQueryFactory, JQ_TOKEN } from './services/jquery.service';
var ɵ0 = jQueryFactory;
var NgEventstoreListingModule = /** @class */ (function () {
    function NgEventstoreListingModule() {
    }
    NgEventstoreListingModule = __decorate([
        NgModule({
            declarations: [
                NgEventstoreListingComponent,
                ItemTemplateHolderComponent,
                TemplateDirective,
            ],
            imports: [CommonModule],
            exports: [
                NgEventstoreListingComponent
            ],
            providers: [
                ScriptService,
                PlaybackService,
                PlaybackListService,
                PushService,
                SocketIoService,
                { provide: JQ_TOKEN, useFactory: ɵ0 }
                // ,
                // { provide: IO_TOKEN, useValue: io }
            ]
        })
    ], NgEventstoreListingModule);
    return NgEventstoreListingModule;
}());
export { NgEventstoreListingModule };
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctZXZlbnRzdG9yZS1saXN0aW5nLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25nLWV2ZW50c3RvcmUtbGlzdGluZy8iLCJzb3VyY2VzIjpbIm5nLWV2ZW50c3RvcmUtbGlzdGluZy5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLDRCQUE0QixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDakYsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sa0VBQWtFLENBQUM7QUFFL0csT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBQ3BFLDRFQUE0RTtBQUU1RSwwQ0FBMEM7QUFDMUMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQzFELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUM5RCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUN2RSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDdEQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQy9ELE9BQU8sRUFBRSxhQUFhLEVBQUUsUUFBUSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7U0FtQi9CLGFBQWE7QUFLbEQ7SUFBQTtJQUF3QyxDQUFDO0lBQTVCLHlCQUF5QjtRQXRCckMsUUFBUSxDQUFDO1lBQ1IsWUFBWSxFQUFFO2dCQUNaLDRCQUE0QjtnQkFDNUIsMkJBQTJCO2dCQUMzQixpQkFBaUI7YUFFbEI7WUFDRCxPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7WUFDdkIsT0FBTyxFQUFFO2dCQUNQLDRCQUE0QjthQUM3QjtZQUNELFNBQVMsRUFBRTtnQkFDVCxhQUFhO2dCQUNiLGVBQWU7Z0JBQ2YsbUJBQW1CO2dCQUNuQixXQUFXO2dCQUNYLGVBQWU7Z0JBQ2YsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLFVBQVUsSUFBZSxFQUFFO2dCQUNoRCxJQUFJO2dCQUNKLHNDQUFzQzthQUN2QztTQUNGLENBQUM7T0FDVyx5QkFBeUIsQ0FBRztJQUFELGdDQUFDO0NBQUEsQUFBekMsSUFBeUM7U0FBNUIseUJBQXlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5nRXZlbnRzdG9yZUxpc3RpbmdDb21wb25lbnQgfSBmcm9tICcuL25nLWV2ZW50c3RvcmUtbGlzdGluZy5jb21wb25lbnQnO1xuaW1wb3J0IHsgSXRlbVRlbXBsYXRlSG9sZGVyQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2l0ZW0tdGVtcGxhdGUtaG9sZGVyL2l0ZW0tdGVtcGxhdGUtaG9sZGVyLmNvbXBvbmVudCc7XG5cbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBUZW1wbGF0ZURpcmVjdGl2ZSB9IGZyb20gJy4vZGlyZWN0aXZlcy90ZW1wbGF0ZS5kaXJlY3RpdmUnO1xuLy8gaW1wb3J0IHsgSU9fVE9LRU4sIFNvY2tldElvU2VydmljZSB9IGZyb20gJy4vc2VydmljZXMvc29ja2V0LmlvLnNlcnZpY2UnO1xuXG4vLyBpbXBvcnQgKiBhcyBpbyBmcm9tICdzb2NrZXQuaW8tY2xpZW50JztcbmltcG9ydCB7IFNjcmlwdFNlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2VzL3NjcmlwdC5zZXJ2aWNlJztcbmltcG9ydCB7IFBsYXliYWNrU2VydmljZSB9IGZyb20gJy4vc2VydmljZXMvcGxheWJhY2suc2VydmljZSc7XG5pbXBvcnQgeyBQbGF5YmFja0xpc3RTZXJ2aWNlIH0gZnJvbSAnLi9zZXJ2aWNlcy9wbGF5YmFjay1saXN0LnNlcnZpY2UnO1xuaW1wb3J0IHsgUHVzaFNlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2VzL3B1c2guc2VydmljZSc7XG5pbXBvcnQgeyBTb2NrZXRJb1NlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2VzL3NvY2tldC5pby5zZXJ2aWNlJztcbmltcG9ydCB7IGpRdWVyeUZhY3RvcnksIEpRX1RPS0VOIH0gZnJvbSAnLi9zZXJ2aWNlcy9qcXVlcnkuc2VydmljZSc7XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW1xuICAgIE5nRXZlbnRzdG9yZUxpc3RpbmdDb21wb25lbnQsXG4gICAgSXRlbVRlbXBsYXRlSG9sZGVyQ29tcG9uZW50LFxuICAgIFRlbXBsYXRlRGlyZWN0aXZlLFxuXG4gIF0sXG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGVdLFxuICBleHBvcnRzOiBbXG4gICAgTmdFdmVudHN0b3JlTGlzdGluZ0NvbXBvbmVudFxuICBdLFxuICBwcm92aWRlcnM6IFtcbiAgICBTY3JpcHRTZXJ2aWNlLFxuICAgIFBsYXliYWNrU2VydmljZSxcbiAgICBQbGF5YmFja0xpc3RTZXJ2aWNlLFxuICAgIFB1c2hTZXJ2aWNlLFxuICAgIFNvY2tldElvU2VydmljZSxcbiAgICB7IHByb3ZpZGU6IEpRX1RPS0VOLCB1c2VGYWN0b3J5OiBqUXVlcnlGYWN0b3J5IH1cbiAgICAvLyAsXG4gICAgLy8geyBwcm92aWRlOiBJT19UT0tFTiwgdXNlVmFsdWU6IGlvIH1cbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBOZ0V2ZW50c3RvcmVMaXN0aW5nTW9kdWxlIHt9XG4iXX0=