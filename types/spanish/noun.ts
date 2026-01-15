import type { Common } from "./common.ts"

export type SpanishNoun = Common & {
  gender?: 'el' | 'la',
  spanish: string,
  plural?: string,
  irregular?: string,
}