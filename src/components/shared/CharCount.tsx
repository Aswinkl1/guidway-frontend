export const CharCount = ({
  current,
  max,
}: {
  current: number;
  max: number;
}) => (
  <p
    className={`text-xs text-right mt-0.5 ${current > max ? "text-red-500" : "text-slate-400"}`}
  >
    {current} / {max}
  </p>
);
