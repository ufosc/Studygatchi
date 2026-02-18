
import React, { useState } from "react";
import GooberMenu from "./components/GooberMenu";
import "./index.css";

export default function RenderGooberMenu() {

  // Current Players data
  const [currentXP, setXP] = useState(50);
  const [level, setLevel] = useState(9);
  const [money, setMoney] = useState(0);
  const [currentHealth, setHealth] = useState(50);

  return(
        <GooberMenu
            setXP={setXP}
            setLevel={setLevel}
            setMoney={setMoney}
            setHealth={setHealth}
            currentXP={currentXP}
            level={level}
            money={money}
            currentHealth={currentHealth}
          />

  )
}