import { useMemo, useState } from "react";

import { uploadDataset } from "../api";

function DatasetUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [schema, setSchema] = useState(null);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const sampleColumns = useMemo(() => {
    if (!schema?.sample_rows?.length) {
      return schema?.columns ?? [];
    }

    return Object.keys(schema.sample_rows[0]);
  }, [schema]);

  function handleFileChange(event) {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
    setSchema(null);
    setError("");
  }

  async function handleUpload(event) {
    event.preventDefault();

    if (!selectedFile) {
      setError("Choose a dataset before uploading.");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      const result = await uploadDataset(selectedFile);
      setSchema(result);
    } catch (caughtError) {
      setSchema(null);
      setError(caughtError.message);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <section className="grid gap-5">
      <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-normal text-slate-950">
              Dataset Upload
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Upload a file to extract its schema.
            </p>
          </div>
          {schema ? (
            <span className="inline-flex w-fit rounded-md bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800">
              Schema ready
            </span>
          ) : null}
        </div>

        <form className="mt-6 grid gap-4" onSubmit={handleUpload}>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            File
            <input
              accept=".csv,.xlsx,.xls,.json"
              className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 file:mr-4 file:rounded-md file:border-0 file:bg-teal-700 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-teal-800"
              onChange={handleFileChange}
              type="file"
            />
          </label>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              className="w-full rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-fit"
              disabled={!selectedFile || isUploading}
              type="submit"
            >
              {isUploading ? "Uploading..." : "Upload dataset"}
            </button>
            <p className="min-h-5 text-sm text-slate-600">
              {selectedFile ? selectedFile.name : "No file selected"}
            </p>
          </div>
        </form>

        {error ? (
          <div className="mt-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        ) : null}
      </div>

      {schema ? (
        <div className="grid gap-5">
          <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid gap-3 sm:grid-cols-3">
              <SummaryField label="File" value={schema.filename} />
              <SummaryField label="Rows" value={schema.row_count} />
              <SummaryField label="Columns" value={schema.column_count} />
            </div>
          </div>

          <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold tracking-normal text-slate-950">
              Columns
            </h3>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-96 border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-normal text-slate-500">
                    <th className="py-3 pr-4 font-semibold">Column</th>
                    <th className="py-3 pr-4 font-semibold">Detected Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {schema.columns.map((column) => (
                    <tr key={column}>
                      <td className="py-3 pr-4 font-medium text-slate-950">{column}</td>
                      <td className="py-3 pr-4 text-slate-700">
                        {schema.data_types?.[column] ?? "unknown"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold tracking-normal text-slate-950">
              Sample Rows
            </h3>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-normal text-slate-500">
                    {sampleColumns.map((column) => (
                      <th className="py-3 pr-4 font-semibold" key={column}>
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {schema.sample_rows.map((row, rowIndex) => (
                    <tr key={`${schema.filename}-${rowIndex}`}>
                      {sampleColumns.map((column) => (
                        <td
                          className="max-w-64 break-words py-3 pr-4 text-slate-700"
                          key={`${rowIndex}-${column}`}
                        >
                          {formatCellValue(row[column])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function SummaryField({ label, value }) {
  return (
    <div className="min-h-24 rounded-md border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-normal text-slate-500">
        {label}
      </p>
      <p className="mt-3 break-words text-base font-semibold text-slate-950">
        {value}
      </p>
    </div>
  );
}

function formatCellValue(value) {
  if (value === null || value === undefined) {
    return "null";
  }

  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  return String(value);
}

export default DatasetUpload;
