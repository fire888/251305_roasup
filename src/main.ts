import { initPipeline } from "./pipelines/initPipeline";
import { playPipeline } from "./pipelines/playPipeline";
import { Root } from "./types/types";

window.addEventListener('load', async () => {
    const root: Root = await initPipeline()
    await playPipeline(root)
})
