import { Injectable } from '@angular/core';
import { Script } from '../models';

declare var document: any;

@Injectable()
export class ScriptService {
  private scripts: any = {};

  constructor() {}

  async init(scriptStore: Script[]) {
    const promises = [];
    scriptStore.forEach((script: Script) => {
      // console.log('SCRIPT STORE LOGGING');
      this.scripts[script.name] = {
        loaded: false,
        src: script.src,
        meta: script.meta,
      };
      promises.push(this.load(script.name));
    });

    return await Promise.all(promises);
  }

  async load(...scripts: string[]): Promise<any> {
    const promises: any[] = [];
    scripts.forEach((script) => promises.push(this.loadScript(script)));
    return await Promise.all(promises);
  }

  loadScript(name: string): Promise<any> {
    return new Promise((resolve, reject) => {
      // resolve if already loaded
      if (this.scripts[name].loaded) {
        // console.log('LOADED');
        resolve({
          script: name,
          loaded: true,
          status: 'Already Loaded',
          meta: this.scripts[name].meta,
        });
      } else {
        const existingScript = document.querySelectorAll(`head script[src="${this.scripts[name].src}"]`);
        if (existingScript.length === 0) {
          // load script
          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.src = this.scripts[name].src;
          if (script.readyState) {
            // IE
            script.onreadystatechange = () => {
              // console.log('ON READYSTATECHANGE');
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
            // console.log('ONLOAD');
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
          console.log('ON ERROR', error);
            resolve({
              script: name,
              loaded: false,
              status: 'Loaded',
              meta: this.scripts[name].meta,
            });
          document.getElementsByTagName('head')[0].appendChild(script);
        } else {
          // console.log('Script already exists');
          resolve();
        }
      }
    });
  }

  getScript(scriptName: string) {
    return this.scripts[scriptName];
  }
}
