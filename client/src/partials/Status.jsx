export const Status = ({ success = true, className = "", icon = false }) =>
  icon ? (
    <div
      className={`${
        success ? "bg-green-500" : "bg-red-500"
      }  p-2 text-center text-white font-bold ${className}`}
    >
      {success ? "✓" : "X"}
    </div>
  ) : (
    <div
      className={`${
        success ? "bg-green-500" : "bg-red-500"
      }  px-3 py-2 w-32 text-center text-white font-bold ${className}`}
    >
      {success ? "Success" : "Failed"}
    </div>
  );
