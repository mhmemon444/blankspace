export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'getSignal' : IDL.Func([IDL.Text], [IDL.Text], ['query']),
    'updateSignal' : IDL.Func([IDL.Text, IDL.Text], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
