import { useState, useRef } from "react";
import axios from "axios";
import StatusBanner from "./StatusBanner";

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // ── File Validation ─────────────────────────────────────────
  const isValidFile = (f) => {
    const validTypes = [".csv", ".xlsx"];
    return validTypes.some((ext) => f.name.endsWith(ext));
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && !isValidFile(selected)) {
      setStatus("error");
      setMessage("Invalid file type. Only .csv and .xlsx are accepted.");
      return;
    }
    setFile(selected || null);
    setStatus("idle");
    setMessage("");
  };

  // ── Drag & Drop ─────────────────────────────────────────────
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && !isValidFile(dropped)) {
      setStatus("error");
      setMessage("Invalid file type. Only .csv and .xlsx are accepted.");
      return;
    }
    if (dropped) setFile(dropped);
  };

  // ── Form Submit ─────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setStatus("error");
      setMessage("Please select a file before submitting.");
      return;
    }

    setStatus("loading");
    setMessage("Uploading file and generating summary... please wait.");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("email", email);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/upload`,
        formData,
        {
          headers: {
            "X-API-Key": import.meta.env.VITE_API_KEY,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setStatus("success");
      setMessage(res.data.message);
      // Reset form
      setFile(null);
      setEmail("");
      if (fileInputRef.current) fileInputRef.current.value = "";

    } catch (err) {
      setStatus("error");
      setMessage(
        err.response?.data?.error || "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900
                    flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">
            📊 Sales Insight Automator
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Upload your quarterly data file and get an AI-generated executive
            summary sent directly to your inbox.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* File Drop Zone */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Sales File <span className="text-slate-400 font-normal">(.csv or .xlsx)</span>
            </label>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl px-4 py-6 text-center cursor-pointer
                          transition-all duration-200
                          ${dragOver
                            ? "border-blue-500 bg-blue-50"
                            : "border-slate-300 hover:border-slate-400 bg-slate-50"
                          }`}
            >
              {file ? (
                <div className="text-sm text-slate-700 font-medium">
                  📎 {file.name}
                  <span className="ml-2 text-slate-400 font-normal">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
              ) : (
                <div className="text-sm text-slate-400">
                  <p className="font-medium text-slate-500">
                    Drag & drop your file here
                  </p>
                  <p className="mt-1">or click to browse</p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Recipient Email
            </label>
            <input
              type="email"
              placeholder="executive@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm
                         text-slate-700 placeholder-slate-400
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         focus:border-transparent transition-all"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-blue-600 hover:bg-blue-700
                       disabled:bg-blue-400 disabled:cursor-not-allowed
                       text-white font-semibold py-2.5 rounded-lg
                       transition-all duration-200 text-sm"
          >
            {status === "loading"
              ? "⏳ Processing..."
              : "Generate & Send Summary →"}
          </button>

        </form>

        {/* Status Banner */}
        <StatusBanner status={status} message={message} />

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-6">
          Powered by Rabbitt AI · Gemini 1.5 Flash
        </p>

      </div>
    </div>
  );
};

export default UploadForm;