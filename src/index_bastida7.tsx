import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainBastida7, TOTAL_FRAMES_7BEB } from "./bastida/Main_bastida7";

// Entry propio del video #2 "7 Bebidas" para el farm — registra la composición aquí
// (el pre-vuelo del farm exige que el id "Bas-Main-7Beb" aparezca en el entry).
const RootBastida7: React.FC = () => (
  <>
    <Composition
      id="Bas-Main-7Beb"
      component={MainBastida7}
      durationInFrames={TOTAL_FRAMES_7BEB}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(RootBastida7);
