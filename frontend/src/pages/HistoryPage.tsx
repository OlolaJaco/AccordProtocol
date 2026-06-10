import type { Proposal } from "../types/accord";
import { ProposalCard } from "../components/ProposalCard";

export function HistoryPage({
  historyProposals,
  onApprove,
}: {
  historyProposals: Proposal[];
  onApprove: (id: number) => void;
}) {
  const noop = () => {};

  return (
    <>
      <h2 className="font-semibold mb-4">Proposal History</h2>
      <div className="space-y-3">
        {historyProposals.length === 0 ? (
          <p className="text-zinc-600 text-sm py-8 text-center">
            No completed proposals yet
          </p>
        ) : (
          historyProposals.map((proposal) => (
            <ProposalCard
              key={proposal.id}
              proposal={proposal}
              walletAddress={null}
              onApprove={onApprove}
              onExecute={noop}
            />
          ))
        )}
      </div>
    </>
  );
}
