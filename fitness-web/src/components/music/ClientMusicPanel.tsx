"use client";

import dynamic from "next/dynamic";

const MusicPanel = dynamic(() => import("./MusicPanel"), { ssr: false });

export default MusicPanel;
