import type { Principal } from '@dfinity/principal';
export interface ConnectionDetails {
  'sdp' : string,
  'initiator' : string,
  'recipient' : string,
  'typeof' : string,
}
export interface _SERVICE {
  'addToCurrentUsers' : (arg_0: string, arg_1: string) => Promise<undefined>,
  'getActiveUsers' : (arg_0: string) => Promise<Array<string>>,
  'getConnectionRequest' : (arg_0: string) => Promise<[] | [ConnectionDetails]>,
  'getDocAccess' : (arg_0: string) => Promise<string>,
  'getDocContents' : (arg_0: string) => Promise<string>,
  'getDocName' : (arg_0: string) => Promise<string>,
  'getFirst' : (arg_0: string) => Promise<[] | [string]>,
  'getUsersDocs' : (arg_0: string) => Promise<Array<string>>,
  'removeFromActive' : (arg_0: string, arg_1: string) => Promise<undefined>,
  'removeUserDoc' : (arg_0: string, arg_1: string) => Promise<undefined>,
  'updateCurrentPeers' : (
      arg_0: string,
      arg_1: string,
      arg_2: string,
      arg_3: string,
    ) => Promise<undefined>,
  'updateDocAccess' : (arg_0: string, arg_1: string) => Promise<undefined>,
  'updateDocContents' : (arg_0: string, arg_1: string) => Promise<undefined>,
  'updateDocName' : (arg_0: string, arg_1: string) => Promise<undefined>,
  'updateUsersDocs' : (arg_0: string, arg_1: string) => Promise<undefined>,
}
