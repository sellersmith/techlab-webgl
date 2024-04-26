import { useSnapshot } from "valtio";
import { state } from "../store";

export function Customizer() {
  const snap = useSnapshot(state);
  return (
    <div className="customizer">
      <div className="color-options">
        {snap.colors.map((color) => (
          <div
            key={color}
            className={`circle`}
            style={{ background: color }}
            onClick={() => (state.color = color)}
          ></div>
        ))}
      </div>
      <div className="decals">
        <div className="decals--container">
          {snap.decals.map((decal) => (
            <div
              key={decal}
              className={`decal`}
              onClick={() => (state.decal = decal)}
            >
              <img
                src={
                  decal.includes("base64")
                    ? decal
                    : decal + `${decal === "pagefly" ? ".png" : ".webp"}`
                }
                alt="brand"
              />
            </div>
          ))}
        </div>
      </div>
      <button
        className="share"
        style={{ background: snap.color }}
        onClick={() => {
          const canvas = document.querySelector("canvas");
          var image = canvas.toDataURL();

          const link = document.createElement("a");
          link.download = "3d_model.png";
          link.href = image;
          link.click();
        }}
      >
        DOWNLOAD
      </button>
      <button
        className="exit"
        style={{ background: snap.color }}
        onClick={() => (state.intro = true)}
      >
        GO BACK
      </button>
    </div>
  );
}
