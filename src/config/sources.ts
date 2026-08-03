import { PcatSource } from "../sources/pcat.js";
import type { JobSource } from "../types.js";

export const SOURCES: JobSource[] = [new PcatSource()];
