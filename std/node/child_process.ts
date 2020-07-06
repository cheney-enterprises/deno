import { notImplemented } from "./_utils.ts";
import { EventEmitter } from "./events.ts";
import { Process } from "./process.ts";
import { sendAsync } from "../../cli/js/ops/dispatch_json.ts";
import {
  run as runSync,
  RunRequest,
  RunResponse,
} from "../../cli/js/ops/process.ts";
import { assert } from "../../cli/js/util.ts";
import { Stdout, Stderr } from "../../cli/js/files.ts";

function runAsync(request: RunRequest): Promise<RunResponse> {
  assert(request.cmd.length > 0);
  return sendAsync("op_run", request);
}

class ChildProcess extends Process {
  readonly signalCode: any | null = null;
  // readonly exitCode: number | null = null;
  readonly killed: boolean = false;
  readonly spawnFile: string | URL | null = null;
  constructor() {
    super();
  }
}

interface cp_opts_interface {
  cwd?: string;
  env?: Object;
  encoding?: string;
  shell?: string;
  timeout?: number;
  maxBuffer?: number;
  killSignal?: string | number;
  uid?: number;
  gid?: number;
  windowsHide?: boolean;
}
interface cp_interface {
  ChildProcess: never;
  exec: (
    cmd: string,
    options?: cp_opts_interface,
    callback?: (error: Error, stdout?: Stdout, stderr?: Stderr) => any,
  ) => Promise<RunResponse>;
  execFile: (
    file: string | File,
    args?: string[],
    options?: cp_opts_interface,
    callback?: (error: Error, stdout?: Stdout, stderr?: Stderr) => any,
  ) => Promise<RunResponse>;
}
