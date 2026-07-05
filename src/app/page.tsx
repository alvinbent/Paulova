import { StitchFrame } from "@/components/stitch/StitchFrame";
import { stitchPages } from "@/components/stitch/pages";

export default function HomePage() {
  return <StitchFrame {...stitchPages.home} />;
}

