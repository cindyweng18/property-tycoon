import { useEffect, useRef, useState } from "react";

const DIE = ["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"] as const;

function Die({
  value,
  rolling,
}: {
  value: number;
  rolling: boolean;
}) {
  return (
    <div
      className={[
        "w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14",
        "bg-white rounded-lg border border-zinc-300 shadow",
        "flex items-center justify-center",
        "text-2xl md:text-3xl lg:text-4xl select-none",
        rolling ? "animate-bounce" : "",
      ].join(" ")}
    >
      {DIE[value]}
    </div>
  );
}

export default function DicePair({
  values,
  rolling,
}: {
  values: [number, number] | null;
  rolling: boolean;
}) {
  const [shown, setShown] = useState<[number, number]>([1, 1]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (rolling) {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = window.setInterval(() => {
        setShown([
          1 + Math.floor(Math.random() * 6),
          1 + Math.floor(Math.random() * 6),
        ] as [number, number]);
      }, 80);
    } else {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (values) setShown(values);
    }
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [rolling, values]);

  return (
    <div className="flex items-center gap-2">
      <Die value={shown[0]} rolling={rolling} />
      <Die value={shown[1]} rolling={rolling} />
    </div>
  );
}