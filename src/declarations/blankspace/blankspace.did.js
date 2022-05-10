export const idlFactory = ({ IDL }) => {
  const ConnectionDetails = IDL.Record({
    'sdp' : IDL.Text,
    'initiator' : IDL.Text,
    'recipient' : IDL.Text,
    'typeof' : IDL.Text,
  });
  return IDL.Service({
<<<<<<< HEAD
    'getActiveUsers' : IDL.Func([], [IDL.Vec(IDL.Text)], []),
=======
    'addToCurrentUsers' : IDL.Func([IDL.Text], [], []),
    'getActiveUsers' : IDL.Func([], [IDL.Vec(IDL.Text)], []),
    'getConnectionRequest' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(ConnectionDetails)],
        [],
      ),
    'removeFromCurrent' : IDL.Func([IDL.Text], [], []),
    'updateCurrentPeers' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Text],
        [],
        [],
      ),
>>>>>>> fc55f13fc45640c8618345d91dc0e7f72af45c9c
  });
};
export const init = ({ IDL }) => { return []; };
