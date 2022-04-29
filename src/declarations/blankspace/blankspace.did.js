export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'gettext' : IDL.Func([], [IDL.Text], ['query']),
    'settext' : IDL.Func([IDL.Text], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
