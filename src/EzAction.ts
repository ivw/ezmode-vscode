export type EzEvent = {}

export type EzAction = {
  perform: (e: EzEvent) => void
  description: string
}
