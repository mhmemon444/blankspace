import type { Principal } from '@dfinity/principal';
export interface ConnectionDetails {
  'sdp' : string,
  'initiator' : string,
  'recipient' : string,
  'typeof' : string,
}
export interface _SERVICE {
  'addToCurrentUsers' : (arg_0: string) => Promise<undefined>,
  'getActiveUsers' : () => Promise<Array<string>>,
  'getConnectionRequest' : (arg_0: string) => Promise<[] | [ConnectionDetails]>,
  'getUsersDocs' : (arg_0: string) => Promise<Array<string>>,
  'removeFromCurrent' : (arg_0: string) => Promise<undefined>,
  'updateCurrentPeers' : (
      arg_0: string,
      arg_1: string,
      arg_2: string,
      arg_3: string,
    ) => Promise<undefined>,
  'updateUsersDocs' : (arg_0: string, arg_1: string) => Promise<undefined>,
}
