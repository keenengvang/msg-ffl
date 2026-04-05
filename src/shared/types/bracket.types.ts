export interface SleeperBracketMatchup {
  r: number
  m: number
  t1: number
  t2: number
  w: number | null
  l: number | null
  t1_from?: { w?: number; l?: number }
  t2_from?: { w?: number; l?: number }
  p?: number
}
