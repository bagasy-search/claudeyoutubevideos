import "./index.css";
import { Composition } from "remotion";
import { MainBastida7, TOTAL_FRAMES_7BEB } from "./bastida/Main_bastida7";

// Root dedicado del video #2 "7 Bebidas" — entry propio para el farm.
export const RootBastida7: React.FC = () => (
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
