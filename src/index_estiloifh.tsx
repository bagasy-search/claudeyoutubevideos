// Pruebas de estilo "fondo pintado + cabezones" (100% código). Uso: ENTRY=src/index_estiloifh.tsx
import { registerRoot, Composition } from "remotion";
import { Prueba1Calle, Prueba2Escondite, Prueba3Streamer, Prueba4Ruta } from "./estilo_ifh/Pruebas";

const R: React.FC = () => (
  <>
    <Composition id="Prueba1Calle" component={Prueba1Calle} durationInFrames={300} fps={30} width={1920} height={1080} />
    <Composition id="Prueba2Escondite" component={Prueba2Escondite} durationInFrames={300} fps={30} width={1920} height={1080} />
    <Composition id="Prueba3Streamer" component={Prueba3Streamer} durationInFrames={300} fps={30} width={1920} height={1080} />
    <Composition id="Prueba4Ruta" component={Prueba4Ruta} durationInFrames={300} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(R);
