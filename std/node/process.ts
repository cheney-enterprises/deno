import { notImplemented } from "./_utils.ts";
import { EventEmitter } from "./events.ts";
import { type } from "./os.ts";

export class Process extends EventEmitter {
  /** https://nodejs.org/api/process.html#process_process_allowednodeenvironmentflags */
  get allowedNodeEnvironmentFlags() {
    return notImplemented(Process.name + ": allowedNodeEnvironmentFlags");
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
    return Deno.execPath() + Deno.args[0];
  }
  /** https://nodejs.org/api/process.html#process_process_channel */
  readonly channel = {
    ref() {
      return notImplemented(Process.name + ": channel.ref()");
    },
    unref() {
      return notImplemented(Process.name + ": channel.unref()");
    },
  };
  /** https://nodejs.org/api/process.html#process_process_config */
  get config() {
    return notImplemented(Process.name + ": config");
  }

  /** https://nodejs.org/api/process.html#process_process_chdir_directory */
  readonly chdir = Deno.chdir;
  /** https://nodejs.org/api/process.html#process_process_connected */
  get connected() {
    return notImplemented(Process.name + ": connected");
  }
  /** https://nodejs.org/api/process.html#process_process_cpuusage_previousvalue */
  cpuUsage(prevVal: any) {
    notImplemented(Process.name + ": " + this.cpuUsage.name);
  }
  /** https://nodejs.org/api/process.html#process_process_cwd */
  readonly cwd = Deno.cwd;
  /** https://nodejs.org/api/process.html#process_process_debugport */
  readonly debugPort = notImplemented;
  readonly disconnect = notImplemented;
  /** https://nodejs.org/api/process.html#process_process_dlopen_module_filename_flags */
  readonly dlopen = notImplemented;
  exitCode: number | null = null;

  /** https://nodejs.org/api/process.html#process_process_pid */
  readonly pid = Deno.pid;

  /** https://nodejs.org/api/process.html#process_process_platform */
  readonly platform = Deno.build.os === "windows" ? "win32" : Deno.build.os;

  /** https://nodejs.org/api/process.html#process_process_version */
  readonly version = `v${Deno.version.deno}`;

  /** https://nodejs.org/api/process.html#process_process_versions */
  readonly versions = {
    node: Deno.version.deno,
    ...Deno.version,
  };
  stderr = Deno.stderr;
  stdin = Deno.stdin;
  stdout = Deno.stdout;
  /** https://nodejs.org/api/process.html#process_process_emitwarning_warning_options */
  emitWarning(warning: string | Error, options?: {
    type?: string;
    code?: string;
    ctor?: Function;
    detail: string;
  }) {
    let details = {
      type: options?.type,
      code: options?.code,
      detail: options?.detail,
      stack: {},
      message: warning,
      name: "Warning",
    };
    if (warning instanceof Error) {
      this.emit("warning", warning);
    } else {
      Error.captureStackTrace(details.stack, options?.ctor);
      this.emit("warning", details);
    }
  }

  /** https://nodejs.org/api/process.html#process_process_exit_code */
  exit(code?: number) {
    this.emit("beforeExit");
    this.exitCode = code ?? 0;
    this.emit("exit");
    Deno.exit(this.exitCode);
  }
  kill(pid: number, signal: string | number = "SIGTERM") {
    let sigType: any;
    let sigNum: number;
    if (this.platform !== "darwin" && this.platform !== "linux") {
      if (typeof signal === "number") {
        this.emit("kill");
        sigNum = signal;
      } else {
        this.emit(signal);
        sigNum = 0;
      }
    }
    if (typeof signal === "string") {
      if (this.platform === "darwin") {
        sigType = Deno.MacOSSignal;
      } else {
        sigType = Deno.LinuxSignal;
      }
      this.emit(signal);
      sigNum = sigType[signal];
    } else {
      this.emit("kill");
      sigNum = signal;
    }
    Deno.kill(this.pid, sigNum);
  }

  /** https://nodejs.org/api/process.html#process_process_env */
  get env(): { [index: string]: string } {
    // Getter delegates --allow-env and --allow-read until request
    // Getter also allows the export Proxy instance to function as intended
    return Deno.env.toObject();
  }
}

/** https://nodejs.org/api/process.html#process_process */
// @deprecated `import { process } from 'process'` for backwards compatibility with old deno versions
const process = new Process();
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

// import process from './std/node/process.ts'
// export default process;

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

var mirror = Object.getOwnPropertyNames(new Process());
console.log(mirror);
