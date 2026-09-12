// Entry standalone de la pizarra del Dr. Federer (studio/still de la pizarra SOLA).
//   npx remotion studio src/FedWhiteboard.entry.tsx
//   npx remotion still  src/FedWhiteboard.entry.tsx FedPielBoard out.png --frame=N --public-dir=/tmp/wbpublic
// El componente + escenas viven en ./FedWhiteboard (que NO llama registerRoot, para
// poder importarse como componente desde otros Main sin doble-registro).
import { registerRoot } from "remotion";
import { RemotionRoot } from "./FedWhiteboard";

registerRoot(RemotionRoot);
