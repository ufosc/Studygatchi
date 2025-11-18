interface Props {
  pageSetter: (arg0: string) => void;
}

export default function GooberPlayMenu({ pageSetter }: Props) {
  return (
    <>
      place gober play menu here
      <button onClick={() => pageSetter("home")}>home</button>
    </>
  );
}
