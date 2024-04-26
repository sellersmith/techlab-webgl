import { proxy } from "valtio";

const state = proxy({
  intro: false,
  colors: ["#ccc", "#EFBD4E", "#80C670", "#726DE8", "#EF674E", "#353934"],
  decals: ["pagefly", "checkmate", "vibe"],
  color: "#EFBD4E",
  decal: "pagefly",
});

export { state };
