import { assert, unitTest, assertMatch, unreachable } from "./test_util.ts";

const openErrorStackPattern = new RegExp(
  `^.*
<<<<<<< HEAD
    at unwrapResponse \\(.*dispatch_json\\.ts:.*\\)
    at Object.sendAsync \\(.*dispatch_json\\.ts:.*\\)
    at async Object\\.open \\(.*files\\.ts:.*\\).*$`,
=======
    at unwrapResponse \\(.*dispatch_json\\.js:.*\\)
    at sendAsync \\(.*dispatch_json\\.js:.*\\)
    at async Object\\.open \\(.*files\\.js:.*\\).*$`,
>>>>>>> ccd0d0eb79db6ad33095ca06e9d491a27379b87a
  "ms",
);

unitTest(
  { perms: { read: true } },
  async function sendAsyncStackTrace(): Promise<void> {
    await Deno.open("nonexistent.txt")
      .then(unreachable)
      .catch((error): void => {
        assertMatch(error.stack, openErrorStackPattern);
      });
  },
);

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Deno {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var core: any; // eslint-disable-line no-var
  }
}

unitTest(function malformedJsonControlBuffer(): void {
  const opId = Deno.core.ops()["op_open"];
  const res = Deno.core.send(opId, new Uint8Array([1, 2, 3, 4, 5]));
  const resText = new TextDecoder().decode(res);
  const resJson = JSON.parse(resText);
  assert(!resJson.ok);
  assert(resJson.err);
});
