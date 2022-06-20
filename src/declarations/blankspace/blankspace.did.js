export const idlFactory = ({ IDL }) => {
  const ConnectionDetails = IDL.Record({
    'sdp' : IDL.Text,
    'initiator' : IDL.Text,
    'recipient' : IDL.Text,
    'typeof' : IDL.Text,
  });
  return IDL.Service({
    'addToCurrentUsers' : IDL.Func([IDL.Text, IDL.Text], [], []),
    'getActiveUsers' : IDL.Func([IDL.Text], [IDL.Vec(IDL.Text)], []),
    'getConnectionRequest' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(ConnectionDetails)],
        [],
      ),
    'getDocAccess' : IDL.Func([IDL.Text], [IDL.Text], ['query']),
    'getDocContents' : IDL.Func([IDL.Text], [IDL.Text], ['query']),
    'getDocName' : IDL.Func([IDL.Text], [IDL.Text], ['query']),
    'getFirst' : IDL.Func([IDL.Text], [IDL.Opt(IDL.Text)], []),
    'getUsersDocs' : IDL.Func([IDL.Text], [IDL.Vec(IDL.Text)], []),
    'removeFromActive' : IDL.Func([IDL.Text, IDL.Text], [], []),
    'removeUserDoc' : IDL.Func([IDL.Text, IDL.Text], [], []),
    'updateCurrentPeers' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Text],
        [],
        [],
      ),
    'updateDocAccess' : IDL.Func([IDL.Text, IDL.Text], [], []),
    'updateDocContents' : IDL.Func([IDL.Text, IDL.Text], [], []),
    'updateDocName' : IDL.Func([IDL.Text, IDL.Text], [], []),
    'updateUsersDocs' : IDL.Func([IDL.Text, IDL.Text], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
