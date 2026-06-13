type GridProps = {
  colomnCount: number;
  children: React.ReactNode;
};

export default function GridCols(props: GridProps) {
  if (props.colomnCount === 3) {
    return <div className="grid grid-cols-3 gap-5">{props.children}</div>;
  } else if (props.colomnCount === 2) {
    return <div className="grid grid-cols-2 gap-5">{props.children}</div>;
  } else {
    return <div className="grid grid-cols-1 gap-5">{props.children}</div>;
  }
}
