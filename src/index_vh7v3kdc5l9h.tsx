// Entry solo-vh7v3kdc5l9h para Remotion (Studio + farm). ENTRY=src/index_vh7v3kdc5l9h.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainVh7, TOTAL_FRAMES_VH7 } from "./_fed6/VideoEdit/Main_vh7v3kdc5l9h";

const Vh7Root: React.FC = () => (
  <Composition id="FedBocaSeca" component={MainVh7} durationInFrames={TOTAL_FRAMES_VH7} fps={30} width={1920} height={1080} />
);

registerRoot(Vh7Root);
