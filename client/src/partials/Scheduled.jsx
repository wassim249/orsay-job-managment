export const Scheduled = ({ scheduled = false }) => (
    <div
      className={`${
        scheduled ? "bg-slate-500" : "bg-slate-700"
      }  px-3 py-2 text-center text-white   font-bold`}
    >
      {scheduled ? "Scheduled" : "Not Scheduled"}
    </div>
  );