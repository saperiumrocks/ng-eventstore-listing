import { InjectionToken } from '@angular/core'

export let JQ_TOKEN = new InjectionToken('jQuery');

declare let jQuery: Object
export function jQueryFactory() {
  return jQuery;
}

