import { useCallback, useEffect, useState } from "react";
import { connectWallet, freighterInstalled, getWalletAddress } from "../lib/wallet";

export type WalletState = {
  installed: boolean;
  address: string | null;
  connecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
};

export function useWallet(): WalletState {
  const [installed, setInstalled] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  // On mount: check if Freighter is present and already authorized
  useEffect(() => {
    freighterInstalled().then((ok) => {
      setInstalled(ok);
      if (ok) {
        getWalletAddress().then((res) => {
          if (res.ok) setAddress(res.value);
        });
      }
    });
  }, []);

  const connect = useCallback(async () => {
    setConnecting(true);
    try {
      const res = await connectWallet();
      if (res.ok) setAddress(res.value);
      else alert(`Freighter error: ${res.error}`);
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    // Freighter has no programmatic disconnect — clear local state only.
    setAddress(null);
  }, []);

  return { installed, address, connecting, connect, disconnect };
}
