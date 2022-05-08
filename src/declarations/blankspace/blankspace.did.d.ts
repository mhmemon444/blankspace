import type { Principal } from '@dfinity/principal';
export interface _SERVICE {
  'addAnswerCandidate' : (arg_0: string, arg_1: string) => Promise<undefined>,
  'addOfferCandidate' : (arg_0: string, arg_1: string) => Promise<undefined>,
  'addPeerOnDoc' : (arg_0: string, arg_1: string) => Promise<undefined>,
  'getAnswerCandidates' : (arg_0: string) => Promise<Array<string>>,
  'getCurrentPeersOnDoc' : (arg_0: string) => Promise<Array<string>>,
  'getOfferCandidates' : (arg_0: string) => Promise<Array<string>>,
  'getSignal' : (arg_0: string) => Promise<string>,
  'updateSignal' : (arg_0: string, arg_1: string) => Promise<undefined>,
}
