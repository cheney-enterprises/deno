import { notImplemented as ni } from "../_utils.ts";

export function notImplemented ( name?: string ) {
    return ni( "Node Process: " + name );
}



/** placed at top level to keep synchronous process functions synchronous */
let runGroupsIds = await Deno.run( {
    cmd: [ "id" ],
    stdout: "piped",
} ).output();

export function parseIds(){
        let entriesArr: ( string | string[] | string[][] )[][] = [];
        new TextDecoder()
            .decode( runGroupsIds )
            .split( " " )
            .map( ( string ) => string.split( "=" ) )
            .forEach( ( entries ) => {
                let temp: ( string | string[] | string[][] )[] = [];
                temp.push( entries[ 0 ] );
                if ( entries[ 0 ] !== "groups" )
                {
                    temp.push(
                        [
                            entries[ 1 ].split( "(" )[ 0 ],
                            entries[ 1 ].split( "(" )[ 1 ].replace( ")", "" ),
                        ],
                    );
                } else
                {
                    temp.push( entries[ 1 ].trim().split( "," ).map( str => {
                        let strArr = str.split( '(' );
                        return [
                            strArr[ 0 ],
                            strArr[ 1 ].split( ')' )[ 0 ]
                        ];
                    } ) );
                }
                entriesArr.push( temp );
            } );

        let obj: { uid: string[]; gid: string[]; groups: string[]; } = Object
            .fromEntries( entriesArr );

        return obj;
    };

type second = number;
type nanosecond = number;

export type hrtimeTuple = [second,nanosecond];

function highrestime ( time?: hrtimeTuple ): hrtimeTuple {
    let ms = performance.now();
    let mult = 1e+9;
    let secs = ms / 1000;
    let arr = secs.toString().split( "." );
    let sec = ( str: string ) => Number( str );
    let nano = ( str: string ) => Number( ( Number( `.${ str }` ) * mult ).toFixed() );
    if ( time )
    {
        let orig = Number( time.join( "." ) );
        let diff = secs - orig;
        let arr2 = diff.toString().split( "." );
        return [ sec( arr2[ 0 ] ), sec( arr2[ 1 ] ) ];
    }
    return [ sec( arr[ 0 ] ), nano( arr[ 1 ] ) ];
}
highrestime.bigint = function(){
    return BigInt(performance.now() * 1e+6);
}

export const hrt = highrestime;

export interface Void extends VoidFunction {
    ( args?:[] ): void;
}

export const signalsObj = {
    1: "SIGHUP",
    2: "SIGINT",
    3: "SIGQUIT",
    4: "SIGILL",
    5: "SIGTRAP",
    6: "SIGABRT",
    7: "SIGEMT",
    8: "SIGFPE",
    9: "SIGKILL",
    10: "SIGBUS",
    11: "SIGSEGV",
    12: "SIGSYS",
    13: "SIGPIPE",
    14: "SIGALRM",
    15: "SIGTERM",
    16: "SIGURG",
    17: "SIGSTOP",
    18: "SIGTSTP",
    19: "SIGCONT",
    20: "SIGCHLD",
    21: "SIGTTIN",
    22: "SIGTTOU",
    23: "SIGIO",
    24: "SIGXCPU",
    25: "SIGXFSZ",
    26: "SIGVTALRM",
    27: "SIGPROF",
    28: "SIGWINCH",
    29: "SIGINFO",
    30: "SIGUSR1",
    31: "SIGUSR2",
    SIGHUP: 1,
    SIGINT: 2,
    SIGQUIT: 3,
    SIGILL: 4,
    SIGTRAP: 5,
    SIGABRT: 6,
    SIGEMT: 7,
    SIGFPE: 8,
    SIGKILL: 9,
    SIGBUS: 10,
    SIGSEGV: 11,
    SIGSYS: 12,
    SIGPIPE: 13,
    SIGALRM: 14,
    SIGTERM: 15,
    SIGURG: 16,
    SIGSTOP: 17,
    SIGTSTP: 18,
    SIGCONT: 19,
    SIGCHLD: 20,
    SIGTTIN: 21,
    SIGTTOU: 22,
    SIGIO: 23,
    SIGXCPU: 24,
    SIGXFSZ: 25,
    SIGVTALRM: 26,
    SIGPROF: 27,
    SIGWINCH: 28,
    SIGINFO: 29,
    SIGUSR1: 30,
    SIGUSR2: 31
}

export type Signals = 1 | "SIGHUP" |
    2 | "SIGINT" |
    3 | "SIGQUIT" |
    4 | "SIGILL" |
    5 | "SIGTRAP" |
    6 | "SIGABRT" |
    7 | "SIGEMT" |
    8 | "SIGFPE" |
    9 | "SIGKILL" |
    10 | "SIGBUS" |
    11 | "SIGSEGV" |
    12 | "SIGSYS" |
    13 | "SIGPIPE" |
    14 | "SIGALRM" |
    15 | "SIGTERM" |
    16 | "SIGURG" |
    17 | "SIGSTOP" |
    18 | "SIGTSTP" |
    19 | "SIGCONT" |
    20 | "SIGCHLD" |
    21 | "SIGTTIN" |
    22 | "SIGTTOU" |
    23 | "SIGIO" |
    24 | "SIGXCPU" |
    25 | "SIGXFSZ" |
    26 | "SIGVTALRM" |
    27 | "SIGPROF" |
    28 | "SIGWINCH" |
    29 | "SIGINFO" |
    30 | "SIGUSR1" |
    31 | "SIGUSR2";