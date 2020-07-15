import { Injectable } from '@angular/core';
import { Script } from '../models';

declare var document: any;

@Injectable()
export class ScriptService {
  private scripts: any = {};

  constructor() {}

  init(scriptStore: Script[]) {
    scriptStore.forEach((script: Script) => {
      this.scripts[script.name] = {
        loaded: false,
        src: script.src,
        meta: script.meta,
      };
    });
  }

  load(...scripts: string[]): Promise<any> {
    const promises: any[] = [];
    scripts.forEach((script) => promises.push(this.loadScript(script)));
    return Promise.all(promises);
  }

  loadScript(name: string): Promise<any> {
    return new Promise((resolve, reject) => {
      // resolve if already loaded
      if (this.scripts[name].loaded) {
        resolve({
          script: name,
          loaded: true,
          status: 'Already Loaded',
          meta: this.scripts[name].meta,
        });
      } else {
        // load script
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = this.scripts[name].src;
        if (script.readyState) {
          // IE
          script.onreadystatechange = () => {
            if (
              script.readyState === 'loaded' ||
              script.readyState === 'complete'
            ) {
              script.onreadystatechange = null;
              this.scripts[name].loaded = true;
              resolve({
                script: name,
                loaded: true,
                status: 'Loaded',
                meta: this.scripts[name].meta,
              });
            }
          };
        } else {
          // Others
          script.onload = () => {
            this.scripts[name].loaded = true;
            resolve({
              script: name,
              loaded: true,
              status: 'Loaded',
              meta: this.scripts[name].meta,
            });
          };
        }
        script.onerror = (error: any) =>
          resolve({
            script: name,
            loaded: false,
            status: 'Loaded',
            meta: this.scripts[name].meta,
          });
        document.getElementsByTagName('head')[0].appendChild(script);
      }
    });
  }
}
