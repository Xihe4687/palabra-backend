import type { Common } from "./common.ts"

export type SpanishAdjective = Common & {
  spanish: string,
  masculine?: string,
  feminine?: string,
  masculinePlural?: string,
  femininePlural?: string,
  irregular?: string,
}