interface Props {
  pageSetter: (arg0: string) => void;
  isBreak: boolean;
  onInteract: () => void;
}

export default function GooberPlayMenu({pageSetter,isBreak,onInteract,}: Props) {
  return (
    <>
      <div style={{ backgroundColor: "var(--bg-color)", padding: "15px" }}>
        <p>
          {isBreak
           ? "Break time! You can play with Goober."
           : "Play is available during break time."}
        </p>
        <button
          type="button"
          className="studygatchi-button"
          onClick={onInteract}
          disabled={!isBreak}
        >
          Play with Goober (+5 health)
        </button>
        <button className="studygatchi-button" onClick={() => pageSetter("home")}>home</button>
      </div>
    </>
  );
}
