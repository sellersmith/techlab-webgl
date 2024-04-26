import { Customizer } from "./Customizer";
import { useSnapshot } from "valtio";
import { Logo } from "@pmndrs/branding";
import { motion } from "framer-motion";
import { state } from "../store";


export function Overlay() {
  const snap = useSnapshot(state);
  const transition = { type: "spring", duration: 0.8 };

  return (
    <div>
      <header>
        <Logo width="40" height="40" />
        <motion.div
          animate={{ x: snap.intro ? 0 : 100, opacity: snap.intro ? 1 : 0 }}
          transition={transition}
        ></motion.div>
      </header>
      <>
        <div key="custom">
          <Customizer />
        </div>
      </>
    </div>
  );
}
