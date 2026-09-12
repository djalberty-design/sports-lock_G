/**
 * Deterministic desk seed. Same DESK_VERSION + snapshot + event → same uint64.
 * FNV-1a 64 mixed into PCG64. No wall-clock, no Math.random.
 */

export function fnv1a64(s: string): bigint {
  let h = 0xcbf29ce484222325n;
  for (let i = 0; i < s.length; i++) {
    h ^= BigInt(s.charCodeAt(i));
    h = (h * 0x100000001b3n) & 0xffffffffffffffffn;
  }
  return h;
}

export function deskSeed(version: string, snapshotId: string, eventId: string): bigint {
  return fnv1a64(`${version}\0${snapshotId}\0${eventId}`);
}

/** PCG-style LCG. Same seed → same stream. */
export class Pcg64 {
  private state: bigint;
  constructor(seed: bigint) {
    this.state = (seed ^ 0x14057b7ef767814fn) & 0xffffffffffffffffn;
    this.next();
  }
  next(): bigint {
    this.state = (this.state * 6364136223846793005n + 1442695040888963407n) & 0xffffffffffffffffn;
    const xorshifted = ((this.state >> 18n) ^ this.state) >> 27n;
    const rot = this.state >> 59n;
    const n = (xorshifted >> rot) | (xorshifted << ((-rot) & 31n));
    return n & 0xffffffffn;
  }
  float(): number {
    const a = this.next();
    const b = this.next();
    const u = (a << 21n) | (b >> 11n);
    return Number(u) / 2 ** 53;
  }
  gauss(): number {
    const u = Math.max(1e-12, this.float());
    const v = this.float();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }
}
