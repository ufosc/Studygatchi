interface Props {
  pageSetter: (arg0: string) => void;
}

export default function GooberFoodMenu({ pageSetter }: Props) {
  return (
    <>
      place gober food menu here
      <button onClick={() => pageSetter("home")}>home</button>
    </>
  );
}
