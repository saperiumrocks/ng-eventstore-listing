import { Script } from '../models';
export declare class ScriptService {
    private scripts;
    constructor();
    init(scriptStore: Script[]): Promise<any[]>;
    load(...scripts: string[]): Promise<any>;
    loadScript(name: string): Promise<any>;
    getScript(scriptName: string): any;
}
