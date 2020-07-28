// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

import {
  notImplemented,
  parseIds,
  hrtimeTuple,
  hrt,
  Void,
  Signals,
  signalsObj
} from "./_process/_proc_utils.ts";
import { EventEmitter } from "./events.ts";
import { type } from "./os.ts";

export class Process extends EventEmitter {

  /** https://nodejs.org/api/process.html#process_process_abort */
  abort(){
    Deno.kill( this.pid, 6 /** SIGABRT SIGNAL */);
  }

  /** https://nodejs.org/api/process.html#process_process_allowednodeenvironmentflags */
  get allowedNodeEnvironmentFlags() {
    return notImplemented("allowedNodeEnvironmentFlags");
  }

  /** https://nodejs.org/api/process.html#process_process_arch */
  readonly arch: string = Deno.build.arch;

  /** https://nodejs.org/api/process.html#process_process_argv */
  get argv(): string[] {
    // Getter delegates --allow-env and --allow-read until request
    // Getter also allows the export Proxy instance to function as intended
    return [Deno.execPath(), ...Deno.args];
  }

  /** https://nodejs.org/api/process.html#process_process_argv0 */
  get argv0(): string {
    return Deno.args[0];
  }

  /** https://nodejs.org/api/process.html#process_process_channel */
  readonly channel = {
    ref() {
      notImplemented("channel.ref()");
    },
    unref() {
      notImplemented("channel.unref()");
    },
  };

  /** https://nodejs.org/api/process.html#process_process_chdir_directory */
  readonly chdir = Deno.chdir;

  /** https://nodejs.org/api/process.html#process_process_config */
  get config() {
    return notImplemented("config");
  }

  /** https://nodejs.org/api/process.html#process_process_connected */
  get connected() {
    return notImplemented("connected");
  }

  /** https://nodejs.org/api/process.html#process_process_cpuusage_previousvalue  THIS DOES NOT RETURN THE SAME VALUES THAT NODE DOES, BUT IT IS SOMEWHAT SIMILAR, AND IT TAKES THE SAME FUNCTION SIGNATURE AND RETURNS AN ARRAY WITH THE SAME FORMAT AS NODE*/
  cpuUsage(prevVal?: [number,number] | [number,number,number]) {
    console.log( Error( "Not Implemented: cpuUsage(prevVal?: [number,number] | [number,number,number])" ) );
    let [a,b] = Deno.loadavg();
    if(prevVal){
      let [c,d] = prevVal;
      return [a - c,b - d]
    }
    return [a,b];
  }

  /** https://nodejs.org/api/process.html#process_process_cwd */
  readonly cwd = Deno.cwd;
  /** https://nodejs.org/api/process.html#process_process_debugport */
  get debugPort() {
    return notImplemented("debugPort");
  }
  /** https://nodejs.org/dist/latest-v14.x/docs/api/process.html#process_process_disconnect */
  disconnect() {
    notImplemented("disconnect()");
  }
  /** https://nodejs.org/api/process.html#process_process_dlopen_module_filename_flags */
  dlopen(module: object, filename: string, flags: any) {
    notImplemented("dlopen(module,filename[,flags])");
  }

  /** https://nodejs.org/api/process.html#process_process_emitwarning_warning_options 
   * 
   * https://nodejs.org/api/process.html#process_process_emitwarning_warning_type_code_ctor
   * 
   * Node has 2 different function signatures for this function. In order to implement this in typescript, the *options* parameter had to be dual-purposed with the *code* and *ctor* parameters added to the end, to reflect the second function signature. 
   * 
   * If the *options* object is used, *code* and *ctor* will be silently ignored.
  */

  emitWarning(warning: string | Error, optionsORtype?: string | {
    type?: string;
    code?: string;
    ctor?: ErrorConstructor;
    detail?: string;
  }, code?: string, ctor?: ErrorConstructor) {
    if(optionsORtype && typeof optionsORtype !== 'string'){
      let details = {
        type: optionsORtype?.type,
        code: optionsORtype?.code,
        detail: optionsORtype?.detail,
        stack: optionsORtype?.ctor ? optionsORtype.ctor.call(this).stack : new Error().stack,
        message: warning,
        name: "Warning",
      };
      if (warning instanceof Error) {
        this.emit("warning", warning);
      } else {
        this.emit("warning", details);
      }
    } else {
      this.emitWarning(warning,{type: optionsORtype,code,ctor});
    }
  }

  /** https://nodejs.org/api/process.html#process_process_env */
  get env (): { [ index: string ]: string; } {
    // Getter delegates --allow-env and --allow-read until request
    // Getter also allows the export Proxy instance to function as intended
    return Deno.env.toObject();
  }

  /** https://nodejs.org/api/process.html#process_process_exit_code */
  exit(code?: number) {
    this.emit("beforeExit");
    this.#_exitCode = code ?? 0;
    this.emit("exit");
    Deno.exit(this.exitCode!);
  }

  #_exitCode: number | null = null;

  /** https://nodejs.org/dist/latest-v14.x/docs/api/process.html#process_process_exitcode */
  get exitCode() {
    return this.#_exitCode;
  }

  #_getids = parseIds();

  getegid() {
    if (Deno.build.os !== "windows") {
      return Number(this.#_getids.gid[0]);
    }
    return;
  }

  geteuid() {
    if (Deno.build.os !== "windows") {
      return Number(this.#_getids.uid[0]);
    }
    return;
  }

  getgid() {
    return this.getegid();
  }

  getuid() {
    return this.geteuid();
  }

  getgroups() {
    if (Deno.build.os !== "windows") {
      return this.#_getids.groups.map((entry) => {
        return Number(entry[0]);
      });
    }
    return;
  }

  /** https://nodejs.org/dist/latest-v14.x/docs/api/process.html#process_process_hrtime_time */
  /** https://nodejs.org/dist/latest-v14.x/docs/api/process.html#process_process_hrtime_bigint */
  hrtime = hrt;

  /** https://nodejs.org/dist/latest-v14.x/docs/api/process.html#process_process_initgroups_user_extragroup */
  initgroups(user: string | number,extraGroup: string | number){
    notImplemented('initgroups(user,extraGroup)');
  }

  /** https://nodejs.org/dist/latest-v14.x/docs/api/process.html#process_process_kill_pid_signal */
  kill ( pid: number, signal: Signals = "SIGTERM" ) {
    let sigType: any;
    let sigNum: number;
    if ( this.platform !== "darwin" && this.platform !== "linux" )
    {
      if ( typeof signal === "number" )
      {
        this.emit( "kill" );
        sigNum = signal;
      } else
      {
        this.emit( signal );
        sigNum = 0;
      }
    }
    if ( typeof signal === "string" )
    {
      if ( this.platform === "darwin" )
      {
        sigType = Deno.MacOSSignal;
      } else
      {
        sigType = Deno.LinuxSignal;
      }
      this.emit( signal );
      sigNum = sigType[ signal ];
    } else
    {
      this.emit( "kill" );
      sigNum = signal;
    }
    Deno.kill( this.pid, sigNum );
  }

  /** https://nodejs.org/dist/latest-v14.x/docs/api/process.html#process_process_memoryusage */
  memoryUsage () {
    notImplemented( 'memoryUsage()' );
  }

  /** https://nodejs.org/dist/latest-v14.x/docs/api/process.html#process_process_nexttick_callback_args */
  nextTick ( callback: Void, ...args: [] ) {
    return queueMicrotask(() => callback(args));
  }

  /** https://nodejs.org/dist/latest-v14.x/docs/api/process.html#process_process_nodeprecation */
  noDeprecation = true;


  /** https://nodejs.org/api/process.html#process_process_pid */
  readonly pid = Deno.pid;

  /** https://nodejs.org/api/process.html#process_process_platform */
  readonly platform = Deno.build.os === "windows" ? "win32" : Deno.build.os;

  readonly ppid = this.pid;

  readonly release = {
    name: `Deno v${Deno.version.deno}`,
    lts: Deno.version.deno,
    sourceUrl: `https://github.com/denoland/deno/archive/v${Deno.version.deno}.tar.gz`,
    headersUrl: '',
    libUrl: ''
  };
  readonly stderr = Deno.stderr;
  readonly stdin = Deno.stdin;
  readonly stdout = Deno.stdout;

  /** https://nodejs.org/api/process.html#process_process_version */
  readonly version = `v${Deno.version.deno}`;

  /** https://nodejs.org/api/process.html#process_process_versions */
  readonly versions = {
    node: Deno.version.deno,
    ...Deno.version,
  };
  
}

/** https://nodejs.org/api/process.html#process_process */
// @deprecated `import { process } from 'process'` for backwards compatibility with old deno versions

export const process = new Process();
export default process;

/**
 * https://nodejs.org/api/process.html#process_process_argv
 * @example `import { argv } from './std/node/process.ts'; console.log(argv)`
 */
// Proxy delegates --allow-env and --allow-read to request time, even for exports
export const argv = new Proxy(process.argv, {});

/**
 * https://nodejs.org/api/process.html#process_process_env
 * @example `import { env } from './std/node/process.ts'; console.log(env)`
 */
// Proxy delegates --allow-env and --allow-read to request time, even for exports
export const env = new Proxy(process.env, {});

// Define the type for the global declaration
// type Process = typeof process;

Object.defineProperty(process, Symbol.toStringTag, {
  enumerable: false,
  writable: true,
  configurable: false,
  value: "process",
});

Object.defineProperty(globalThis, "process", {
  value: process,
  enumerable: false,
  writable: true,
  configurable: true,
});

declare global {
  const process: Process;
}



let proc = new Process();

let getNode = await Deno.run({
  cmd: [ 'node', '--input-type=module', '-e',"import process from 'process';let arr = Object.keys(process).filter(str=>{if(str[0] !== '_'){return str}});process.stdout.write(arr.toString());"],
  stdout: 'piped'
}).output();

let nodeProc = new TextDecoder().decode(getNode).split(',').sort();

let denoProc = [...Object.getOwnPropertyNames(Process.prototype),...Object.keys(proc)].filter(val=>{if(val[0] !== '_'){return val}}).sort();

console.log(`\nnodeProc: ${nodeProc}\n\ndenoProc: ${denoProc}`);
