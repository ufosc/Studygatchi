interface Props {
  pageSetter: (arg0: string) => void;
}

export default function GooberFoodMenu({ pageSetter }: Props) {
  return (
    <>
      <div style = {{backgroundColor: "var(--bg-color)", padding: "15px"}}>
        place gober food menu here
        <button onClick={() => pageSetter("home")}>home</button>
      </div>
    </>
  );
}
