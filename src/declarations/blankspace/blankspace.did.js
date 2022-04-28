export const idlFactory = ({ IDL }) => {
  return IDL.Service({ 'settext' : IDL.Func([IDL.Text], [], []) });
};
export const init = ({ IDL }) => { return []; };
