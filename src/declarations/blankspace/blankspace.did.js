export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'addAnswerCandidate' : IDL.Func([IDL.Text, IDL.Text], [], []),
    'addOfferCandidate' : IDL.Func([IDL.Text, IDL.Text], [], []),
    'addPeerOnDoc' : IDL.Func([IDL.Text, IDL.Text], [], []),
    'getAnswerCandidates' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(IDL.Text)],
        ['query'],
      ),
    'getCurrentPeersOnDoc' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(IDL.Text)],
        ['query'],
      ),
    'getOfferCandidates' : IDL.Func([IDL.Text], [IDL.Vec(IDL.Text)], ['query']),
    'getSignal' : IDL.Func([IDL.Text], [IDL.Text], ['query']),
    'updateSignal' : IDL.Func([IDL.Text, IDL.Text], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
