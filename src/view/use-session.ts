/**
 * V binds to VM here. Commands live on the session. This hook is the
 * subscribe wire so a click does not need a React bump.
 */

import { useMemo, useSyncExternalStore } from "react";
import {
  createSession,
  type MapSession,
  type SessionSnapshot,
} from "@/viewmodel/session.ts";
import type { ScenarioId } from "@/model/types.ts";

export function useSession(
  seed: number,
  scenario: ScenarioId,
): { session: MapSession } & SessionSnapshot {
  const session = useMemo(() => createSession(seed, scenario), [seed, scenario]);
  const snap = useSyncExternalStore(
    session.subscribe,
    session.getSnapshot,
    session.getSnapshot,
  );
  return { session, ...snap };
}
