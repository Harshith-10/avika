import { Float } from "../ui/float";

export default function CornerBoxes() {
  return (
    <>
      <Float placement="bottom-start" className="p-1 bg-background border" />
      <Float placement="bottom-end" className="p-1 bg-background border" />
    </>
  );
}
