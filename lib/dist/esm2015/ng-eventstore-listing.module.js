import * as tslib_1 from "tslib";
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
const ɵ0 = jQueryFactory;
let NgEventstoreListingModule = class NgEventstoreListingModule {
};
NgEventstoreListingModule = tslib_1.__decorate([
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
export { NgEventstoreListingModule };
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctZXZlbnRzdG9yZS1saXN0aW5nLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25nLWV2ZW50c3RvcmUtbGlzdGluZy8iLCJzb3VyY2VzIjpbIm5nLWV2ZW50c3RvcmUtbGlzdGluZy5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLDRCQUE0QixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDakYsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sa0VBQWtFLENBQUM7QUFFL0csT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBQ3BFLDRFQUE0RTtBQUU1RSwwQ0FBMEM7QUFDMUMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQzFELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUM5RCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUN2RSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDdEQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQy9ELE9BQU8sRUFBRSxhQUFhLEVBQUUsUUFBUSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7V0FtQi9CLGFBQWE7QUFLbEQsSUFBYSx5QkFBeUIsR0FBdEMsTUFBYSx5QkFBeUI7Q0FBRyxDQUFBO0FBQTVCLHlCQUF5QjtJQXRCckMsUUFBUSxDQUFDO1FBQ1IsWUFBWSxFQUFFO1lBQ1osNEJBQTRCO1lBQzVCLDJCQUEyQjtZQUMzQixpQkFBaUI7U0FFbEI7UUFDRCxPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7UUFDdkIsT0FBTyxFQUFFO1lBQ1AsNEJBQTRCO1NBQzdCO1FBQ0QsU0FBUyxFQUFFO1lBQ1QsYUFBYTtZQUNiLGVBQWU7WUFDZixtQkFBbUI7WUFDbkIsV0FBVztZQUNYLGVBQWU7WUFDZixFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsVUFBVSxJQUFlLEVBQUU7WUFDaEQsSUFBSTtZQUNKLHNDQUFzQztTQUN2QztLQUNGLENBQUM7R0FDVyx5QkFBeUIsQ0FBRztTQUE1Qix5QkFBeUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTmdFdmVudHN0b3JlTGlzdGluZ0NvbXBvbmVudCB9IGZyb20gJy4vbmctZXZlbnRzdG9yZS1saXN0aW5nLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBJdGVtVGVtcGxhdGVIb2xkZXJDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvaXRlbS10ZW1wbGF0ZS1ob2xkZXIvaXRlbS10ZW1wbGF0ZS1ob2xkZXIuY29tcG9uZW50JztcblxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IFRlbXBsYXRlRGlyZWN0aXZlIH0gZnJvbSAnLi9kaXJlY3RpdmVzL3RlbXBsYXRlLmRpcmVjdGl2ZSc7XG4vLyBpbXBvcnQgeyBJT19UT0tFTiwgU29ja2V0SW9TZXJ2aWNlIH0gZnJvbSAnLi9zZXJ2aWNlcy9zb2NrZXQuaW8uc2VydmljZSc7XG5cbi8vIGltcG9ydCAqIGFzIGlvIGZyb20gJ3NvY2tldC5pby1jbGllbnQnO1xuaW1wb3J0IHsgU2NyaXB0U2VydmljZSB9IGZyb20gJy4vc2VydmljZXMvc2NyaXB0LnNlcnZpY2UnO1xuaW1wb3J0IHsgUGxheWJhY2tTZXJ2aWNlIH0gZnJvbSAnLi9zZXJ2aWNlcy9wbGF5YmFjay5zZXJ2aWNlJztcbmltcG9ydCB7IFBsYXliYWNrTGlzdFNlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2VzL3BsYXliYWNrLWxpc3Quc2VydmljZSc7XG5pbXBvcnQgeyBQdXNoU2VydmljZSB9IGZyb20gJy4vc2VydmljZXMvcHVzaC5zZXJ2aWNlJztcbmltcG9ydCB7IFNvY2tldElvU2VydmljZSB9IGZyb20gJy4vc2VydmljZXMvc29ja2V0LmlvLnNlcnZpY2UnO1xuaW1wb3J0IHsgalF1ZXJ5RmFjdG9yeSwgSlFfVE9LRU4gfSBmcm9tICcuL3NlcnZpY2VzL2pxdWVyeS5zZXJ2aWNlJztcblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgTmdFdmVudHN0b3JlTGlzdGluZ0NvbXBvbmVudCxcbiAgICBJdGVtVGVtcGxhdGVIb2xkZXJDb21wb25lbnQsXG4gICAgVGVtcGxhdGVEaXJlY3RpdmUsXG5cbiAgXSxcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXG4gIGV4cG9ydHM6IFtcbiAgICBOZ0V2ZW50c3RvcmVMaXN0aW5nQ29tcG9uZW50XG4gIF0sXG4gIHByb3ZpZGVyczogW1xuICAgIFNjcmlwdFNlcnZpY2UsXG4gICAgUGxheWJhY2tTZXJ2aWNlLFxuICAgIFBsYXliYWNrTGlzdFNlcnZpY2UsXG4gICAgUHVzaFNlcnZpY2UsXG4gICAgU29ja2V0SW9TZXJ2aWNlLFxuICAgIHsgcHJvdmlkZTogSlFfVE9LRU4sIHVzZUZhY3Rvcnk6IGpRdWVyeUZhY3RvcnkgfVxuICAgIC8vICxcbiAgICAvLyB7IHByb3ZpZGU6IElPX1RPS0VOLCB1c2VWYWx1ZTogaW8gfVxuICBdXG59KVxuZXhwb3J0IGNsYXNzIE5nRXZlbnRzdG9yZUxpc3RpbmdNb2R1bGUge31cbiJdfQ==