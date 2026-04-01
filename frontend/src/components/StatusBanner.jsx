const StatusBanner = ({ status, message }) => {
  if (status === "idle") return null;

  const styles = {
    loading: {
      wrapper: "bg-blue-50 border-blue-200 text-blue-700",
      icon: "⏳",
    },
    success: {
      wrapper: "bg-green-50 border-green-200 text-green-700",
      icon: "✅",
    },
    error: {
      wrapper: "bg-red-50 border-red-200 text-red-700",
      icon: "❌",
    },
  };

  const current = styles[status];

  return (
    <div className={`mt-5 border rounded-lg px-4 py-3 text-sm font-medium ${current.wrapper}`}>
      {current.icon} {message}
    </div>
  );
};

export default StatusBanner;
