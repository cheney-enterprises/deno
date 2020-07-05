import { notImplemented } from "./_utils.ts";
import { EventEmitter } from './events.ts';

export class Process extends EventEmitter {

  /** https://nodejs.org/api/process.html#process_process_arch */
  arch: string = Deno.build.arch;

  /** https://nodejs.org/api/process.html#process_process_chdir_directory */
  chdir = Deno.chdir;

  /** https://nodejs.org/api/process.html#process_process_cwd */
  cwd = Deno.cwd;

  exitCode: number | null = null;

  /** https://nodejs.org/api/process.html#process_process_pid */
  pid = Deno.pid;

  /** https://nodejs.org/api/process.html#process_process_platform */
  platform = Deno.build.os === "windows" ? "win32" : Deno.build.os;

  /** https://nodejs.org/api/process.html#process_process_version */
  version = `v${Deno.version.deno}`;

  /** https://nodejs.org/api/process.html#process_process_versions */
  versions = {
    node: Deno.version.deno,
    ...Deno.version,
  };
  stderr = Deno.stderr;
  stdin = Deno.stdin;
  stdout = Deno.stdout;

  /** https://nodejs.org/api/process.html#process_process_exit_code */
  exit ( code?: number ) {
    this.emit( 'beforeExit' );
    this.exitCode = code ?? 0;
    this.emit( 'exit' );
    Deno.exit( this.exitCode );
    
  }
  kill(pid: number,signal: string | number = 'SIGTERM'){
    let sigType: any;
    let sigNum: number;
    if(this.platform !== 'darwin' && this.platform !== 'linux'){
      if(typeof signal === 'number'){
        this.emit( 'kill' );
        sigNum = signal;
      } else {
        this.emit( signal );
        sigNum = 0;
      }
    }
    if(typeof signal === 'string'){
      if ( this.platform === 'darwin')
      {
        sigType = Deno.MacOSSignal;
      } else
      {
        sigType = Deno.LinuxSignal;
      }
      this.emit(signal);
      sigNum = sigType[signal];
    } else {
      this.emit('kill');
      sigNum = signal;
    }
    Deno.kill(this.pid,sigNum);
  }
  get argv (): string[] {
    // Getter delegates --allow-env and --allow-read until request
    // Getter also allows the export Proxy instance to function as intended
    return [Deno.execPath(), ...Deno.args];
  }

  get argv0 (): string {
    return Deno.execPath()+Deno.args[0];
  }

  /** https://nodejs.org/api/process.html#process_process_env */
  get env(): { [index: string]: string } {
    // Getter delegates --allow-env and --allow-read until request
    // Getter also allows the export Proxy instance to function as intended
    return Deno.env.toObject();
  }
}

export const process = new Process();
/** https://nodejs.org/api/process.html#process_process */
// @deprecated `import { process } from 'process'` for backwards compatibility with old deno versions
// process = {
//   arch,
//   chdir,
//   cwd,
//   exit,
//   pid,
//   platform,
//   version,
//   versions,

//   /** https://nodejs.org/api/process.html#process_process_events */
//   // on is not exported by node, it is only available within process:
//   // node --input-type=module -e "import { on } from 'process'; console.log(on)"
//   on(_event: string, _callback: Function): void {
//     // TODO(rsp): to be implemented
//     notImplemented();
//   },

//   /** https://nodejs.org/api/process.html#process_process_argv */
//   get argv(): string[] {
//     // Getter delegates --allow-env and --allow-read until request
//     // Getter also allows the export Proxy instance to function as intended
//     return [Deno.execPath(), ...Deno.args];
//   },

//   /** https://nodejs.org/api/process.html#process_process_env */
//   get env(): { [index: string]: string } {
//     // Getter delegates --allow-env and --allow-read until request
//     // Getter also allows the export Proxy instance to function as intended
//     return Deno.env.toObject();
//   },
// };

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

// import process from './std/node/process.ts'
// export default process;

// Define the type for the global declration
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
