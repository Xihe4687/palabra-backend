import type { Common } from "./common.ts";

export type SpanishVerb = Common & {
  infinity: string,
  past1?: string,
  past3?: string,
  past1s?: string,
  past3s?: string,
  ing?: string,
  have?: string,
  present1?: string,
  present3?: string,
  present1s?: string,
  present3s?: string
}