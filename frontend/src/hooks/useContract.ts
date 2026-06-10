import { useCallback, useEffect, useState } from "react";
import {
  getOwners,
  getProposalsPaged,
  getThreshold,
  getTotalProposals,
  mapProposal,
} from "../lib/contract";
import type { DashboardStat, Owner, Proposal } from "../types/accord";

type ContractState = {
  proposals: Proposal[];
  owners: Owner[];
  stats: DashboardStat[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
};

export function useContract(): ContractState {
  const [tick, setTick] = useState(0);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const [ownerAddrs, thresh, total] = await Promise.all([
          getOwners(),
          getThreshold(),
          getTotalProposals(),
        ]);

        const raw = total > 0 ? await getProposalsPaged(0, Math.min(total, 50)) : [];

        if (cancelled) return;

        const mapped = raw.map((p) => mapProposal(p, thresh));

        setProposals(mapped);
        setOwners(
          ownerAddrs.map((addr, i) => ({
            address: `${addr.slice(0, 6)}...${addr.slice(-4)}`,
            label: i === 0 ? "You" : `Signer ${i + 1}`,
          }))
        );

        const active = mapped.filter((p) =>
          ["pending", "ready"].includes(p.status)
        ).length;
        const executed = mapped.filter((p) => p.status === "executed").length;

        setStats([
          {
            label: "Threshold",
            value: `${thresh} of ${ownerAddrs.length}`,
            sub: "signers required",
          },
          { label: "Active", value: String(active), sub: "proposals" },
          { label: "Total", value: String(total), sub: "proposals created" },
          { label: "Executed", value: String(executed), sub: "all time" },
        ]);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load contract data"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [tick]);

  return { proposals, owners, stats, loading, error, refresh };
}
