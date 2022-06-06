export const idlFactory = ({ IDL }) => {
  const ConnectionDetails = IDL.Record({
    'sdp' : IDL.Text,
    'initiator' : IDL.Text,
    'recipient' : IDL.Text,
    'typeof' : IDL.Text,
  });
  return IDL.Service({
    'addToCurrentUsers' : IDL.Func([IDL.Text], [], []),
    'getActiveUsers' : IDL.Func([], [IDL.Vec(IDL.Text)], []),
    'getConnectionRequest' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(ConnectionDetails)],
        [],
      ),
    'getDocName' : IDL.Func([IDL.Text], [IDL.Text], ['query']),
    'getUsersDocs' : IDL.Func([IDL.Text], [IDL.Vec(IDL.Text)], ['query']),
    'removeFromCurrent' : IDL.Func([IDL.Text], [], []),
    'updateCurrentPeers' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Text],
        [],
        [],
      ),
    'updateDocName' : IDL.Func([IDL.Text, IDL.Text], [], []),
    'updateUsersDocs' : IDL.Func([IDL.Text, IDL.Text], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
