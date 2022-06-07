export const idlFactory = ({ IDL }) => {
  const ConnectionDetails = IDL.Record({
    'sdp' : IDL.Text,
    'initiator' : IDL.Text,
    'recipient' : IDL.Text,
    'typeof' : IDL.Text,
  });
  return IDL.Service({
    'addConnectionRequest' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Text],
        [],
        [],
      ),
    'getConnectionRequest' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(ConnectionDetails)],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
