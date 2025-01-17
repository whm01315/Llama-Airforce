import { Subscription } from "rxjs";
import { minDelay } from "@/Util";
import { useCurveMonitorStore } from "@/Pages/CurveMonitor/Store";
import type { Pool } from "@/Pages/CurveMonitor/Models";
import {
  PoolService,
  ReservesService,
  CandleService,
  VolumeService,
  TransactionService,
} from "@/Pages/CurveMonitor/Services";

export async function getPools(
  store: ReturnType<typeof useCurveMonitorStore>,
  service: PoolService
) {
  // Don't request new pools if there's already cached or loading.
  if (store.pools.length > 0 || store.poolsLoading) {
    return;
  }

  store.poolsLoading = true;
  const resp = await minDelay(service.get());

  if (resp) {
    store.pools = resp;
  } else {
    store.poolsLoadingError = true;
  }

  store.poolsLoading = false;
}

export async function getReserves(
  store: ReturnType<typeof useCurveMonitorStore>,
  service: ReservesService,
  pool?: Pool
) {
  if (!pool) {
    return;
  }

  // Don't request new reserves if there's already cached.
  if (store.reserves[pool.name]) {
    return;
  }

  // Introduce delay so the animation doesn't lag immediately.
  store.poolsLoading = true;

  try {
    const reserves = await minDelay(service.get(pool), 500);

    if (reserves) {
      store.setReserves(pool.id, reserves);
    }
  } finally {
    store.poolsLoading = false;
  }
}

export async function getCandles(
  store: ReturnType<typeof useCurveMonitorStore>,
  service: CandleService,
  pool?: Pool
) {
  if (!pool) {
    return;
  }

  // Don't request new candles if there's already cached.
  if (store.candles[pool.name]) {
    return;
  }

  // Introduce delay so the animation doesn't lag immediately.
  store.poolsLoading = true;

  try {
    const candles = await minDelay(service.get(pool), 500);

    if (candles) {
      store.setCandles(pool.id, candles);
    }
  } finally {
    store.poolsLoading = false;
  }
}

export async function getVolumes(
  store: ReturnType<typeof useCurveMonitorStore>,
  service: VolumeService,
  pool?: Pool
) {
  if (!pool) {
    return;
  }

  // Don't request new volumes if there's already cached.
  if (store.volumes[pool.name]) {
    return;
  }

  // Introduce delay so the animation doesn't lag immediately.
  store.poolsLoading = true;

  try {
    const volumes = await minDelay(service.get(pool), 500);

    if (volumes) {
      store.setVolumes(pool.id, volumes);
    }
  } finally {
    store.poolsLoading = false;
  }
}

let subscriptionTx: Subscription | null = null;
export function getTransactions(
  store: ReturnType<typeof useCurveMonitorStore>,
  service: TransactionService,
  pool: Pool
): Subscription | null {
  if (subscriptionTx) {
    return subscriptionTx;
  }
  // TODO: unsusbscribe if different pool.

  // Introduce delay so the animation doesn't lag immediately.
  store.poolsLoading = true;

  try {
    subscriptionTx = service.get$.subscribe({
      next: (tx) => {
        store.addTransaction(pool.id, tx);
      },
      error: (err) => console.error(err),
    });
    service.connect();
  } catch (err) {
    console.error(err);
  } finally {
    store.poolsLoading = false;
  }

  return subscriptionTx;
}
