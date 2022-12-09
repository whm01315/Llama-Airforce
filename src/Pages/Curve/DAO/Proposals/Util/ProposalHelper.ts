import {
  Proposal,
  ProposalStatus,
} from "@/Pages/Curve/DAO/Proposals/Models/Proposal";

export function getStatus(proposal: Proposal): ProposalStatus {
  if (proposal.executed) {
    return "executed";
  }

  if (proposal.end > new Date().getTime() / 1000) {
    return "active";
  }

  const forsWin = proposal.votesFor > proposal.votesAgainst;
  const reachedQuorum =
    proposal.votesFor + proposal.votesAgainst >
    proposal.quorum * proposal.totalSupply;
  const reachedSupport =
    proposal.votesFor >
    proposal.support * proposal.quorum * proposal.totalSupply;

  if (forsWin && reachedQuorum && reachedSupport) {
    return "passed";
  }

  return "denied";
}
