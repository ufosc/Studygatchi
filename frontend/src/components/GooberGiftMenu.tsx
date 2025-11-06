interface Props {
  pageSetter: (arg0: string) => void;
}

export default function GooberGiftMenu({ pageSetter }: Props) {
  return (
    <>
      place gober gift menu here
      <button onClick={() => pageSetter("home")}>home</button>
    </>
  );
}
