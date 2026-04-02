interface Props {
  pageSetter: (arg0: string) => void;
}

export default function GooberPlayMenu({ pageSetter }: Props) {
  return (
    <>
      <div style = {{backgroundColor: "var(--bg-color)", padding: "15px"}}>
        place gober play menu here
        <button onClick={() => pageSetter("home")}>home</button>
      </div>
    </>
  );
}
