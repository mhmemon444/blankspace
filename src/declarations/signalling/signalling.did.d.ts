import type { Principal } from '@dfinity/principal';
export interface ConnectionDetails {
  'sdp' : string,
  'initiator' : string,
  'recipient' : string,
  'typeof' : string,
}
export interface _SERVICE {
  'addConnectionRequest' : (
      arg_0: string,
      arg_1: string,
      arg_2: string,
      arg_3: string,
    ) => Promise<undefined>,
  'getConnectionRequest' : (arg_0: string) => Promise<[] | [ConnectionDetails]>,
}
