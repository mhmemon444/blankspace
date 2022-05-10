export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'getActiveUsers' : IDL.Func([], [IDL.Vec(IDL.Text)], []),
  });
};
export const init = ({ IDL }) => { return []; };
