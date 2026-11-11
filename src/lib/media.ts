import lampBefore from "../assets/demo/lamp-before.svg";
import trashBefore from "../assets/demo/trash-before.svg";
import sidewalkBefore from "../assets/demo/sidewalk-before.svg";
import sidewalkAfter from "../assets/demo/sidewalk-after.svg";
// Data demo menyimpan referensi "demo:nama" (bukan URL ber-hash) agar tetap valid
// setelah build ulang. Foto unggahan pengguna berupa data URL dan dipakai apa adanya.
const demo: Record<string, string> = {
  "demo:lamp-before": lampBefore,
  "demo:trash-before": trashBefore,
  "demo:sidewalk-before": sidewalkBefore,
  "demo:sidewalk-after": sidewalkAfter,
};
export const resolveImage = (src?: string): string | undefined =>
  src ? (demo[src] ?? src) : undefined;
