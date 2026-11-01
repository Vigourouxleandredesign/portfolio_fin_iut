/**
 * @file Bust hero — device capability gate
 * @description The 3D bust (three.js, Rapier, Draco, `bust.glb`) is a mouse experience: left click paints,
 *   right click turns the bust. It is loaded only on a hovering, fine pointer (mouse / trackpad), when
 *   motion is allowed and the visitor did not ask to save data. Everywhere else (phones, tablets,
 *   reduced motion) the static hero image stays as the final visual and **nothing** of the 3D is
 *   downloaded (red team audit of 25/10, P1-1 a — decision of 2026-10-26: accessibility and UX first).
 */

type NetworkInformationLike = { saveData?: boolean; effectiveType?: string };

function connectionOf(win: Window): NetworkInformationLike | undefined {
  return (win.navigator as Navigator & { connection?: NetworkInformationLike }).connection;
}

function matches(win: Window, query: string): boolean {
  return typeof win.matchMedia === 'function' && win.matchMedia(query).matches;
}

/** `true` on a mouse / trackpad (hover + fine pointer): the only devices that get the brush and the 3D bust. */
export function hasFinePointer(win: Window = window): boolean {
  return matches(win, '(hover: hover) and (pointer: fine)');
}

/** `true` when the interactive 3D bust may be mounted on this device. */
export function canMountBust(win: Window = window): boolean {
  if (matches(win, '(prefers-reduced-motion: reduce)')) return false;
  if (!hasFinePointer(win)) return false;
  if (connectionOf(win)?.saveData === true) return false;
  return true;
}

/**
 * `true` on touch devices or slow connections: the opening veil must not wait for the 3D / slow
 * resources beyond a short cap.
 */
export function isConstrainedDevice(win: Window = window): boolean {
  if (matches(win, '(hover: none) and (pointer: coarse)')) return true;
  const connection = connectionOf(win);
  if (connection?.saveData === true) return true;
  return ['slow-2g', '2g', '3g'].includes(connection?.effectiveType ?? '');
}
