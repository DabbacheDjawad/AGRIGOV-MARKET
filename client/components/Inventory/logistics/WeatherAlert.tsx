interface Props {
  title: string;
  message: string;
}

export default function WeatherAlert({ title, message }: Props) {
  return (
    <div className="bg-primary/5 rounded-xl border border-primary/20 p-4">
      <div className="flex gap-3">
        <span className="material-icons text-primary-dark dark:text-primary shrink-0">info</span>
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{message}</p>
        </div>
      </div>
    </div>
  );
}