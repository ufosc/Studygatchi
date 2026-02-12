interface Props {
  pageSetter: (arg0: string) => void;
}

export default function GooberGiftMenu({ pageSetter }: Props) {
  return (
    <>
      <div style = {{backgroundColor: "var(--bg-color)", padding: "15px"}}>
        place gober gift menu here
        <button onClick={() => pageSetter("home")}>home</button>
      </div>
    </>
  );
}
