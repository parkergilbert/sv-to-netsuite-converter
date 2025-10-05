import React, { useState } from 'react';
import { Upload, Download, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

interface JournalEntry {
  'Transaction Date': string;
  'Account': string;
  'Debit': string | number;
  'Credit': string | number;
  'Memo': string;
  'Department': string;
  'Class': string;
  'Location': string;
  'Currency': string;
  'Exchange Rate': string;
}

interface ProcessingResult {
  message: string;
  originalRowCount: number;
  journalEntries: JournalEntry[];
  sampleData: any[];
}

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setError(null);
      setResult(null);
    } else {
      setError('Please select a valid CSV file');
      setFile(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const processFile = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    const formData = new FormData();
    formData.append('csvFile', file);

    try {
      const response = await axios.post('/api/upload-csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error processing file');
    } finally {
      setIsProcessing(false);
    }
  };

  const exportJournalEntries = async () => {
    if (!result?.journalEntries) return;

    setIsExporting(true);
    try {
      const response = await axios.post('/api/export-journal', {
        journalEntries: result.journalEntries
      }, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'netsuite-journal-entries.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error exporting file');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="container">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-white mb-2">
          CSV to NetSuite Journal Converter
        </h1>
        <p className="text-white text-lg">
          Upload your CSV file and transform it into NetSuite journal entries
        </p>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Upload size={24} />
          Upload CSV File
        </h2>

        <div
          className={`border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer transition-colors ${
            file ? 'border-green-500 bg-green-50' : 'hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <input
            id="file-input"
            type="file"
            accept=".csv"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            className="hidden"
          />
          
          {file ? (
            <div className="text-green-600">
              <CheckCircle size={48} className="mx-auto mb-2" />
              <p className="text-lg font-medium">{file.name}</p>
              <p className="text-sm text-gray-600">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          ) : (
            <div>
              <FileText size={48} className="mx-auto mb-2 text-gray-400" />
              <p className="text-lg font-medium text-gray-600">
                Drop your CSV file here or click to browse
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Supported format: .csv files only
              </p>
            </div>
          )}
        </div>

        {file && (
          <div className="mt-4 text-center">
            <button
              onClick={processFile}
              disabled={isProcessing}
              className="btn"
            >
              {isProcessing ? (
                <>
                  <div className="loading"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  Process File
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={20} className="inline mr-2" />
          {error}
        </div>
      )}

      {result && (
        <div className="card">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle size={24} className="text-green-600" />
            Processing Results
          </h2>

          <div className="alert alert-success">
            <CheckCircle size={20} className="inline mr-2" />
            {result.message}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700">Original Rows</h3>
              <p className="text-2xl font-bold text-blue-600">{result.originalRowCount}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700">Journal Entries</h3>
              <p className="text-2xl font-bold text-green-600">{result.journalEntries.length}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700">Status</h3>
              <p className="text-lg font-bold text-green-600">Ready for Export</p>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={exportJournalEntries}
              disabled={isExporting}
              className="btn btn-success"
            >
              {isExporting ? (
                <>
                  <div className="loading"></div>
                  Exporting...
                </>
              ) : (
                <>
                  <Download size={20} />
                  Download NetSuite Journal CSV
                </>
              )}
            </button>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-bold mb-4">Preview - First 5 Journal Entries</h3>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Account</th>
                    <th>Debit</th>
                    <th>Credit</th>
                    <th>Memo</th>
                    <th>Department</th>
                  </tr>
                </thead>
                <tbody>
                  {result.journalEntries.slice(0, 5).map((entry, index) => (
                    <tr key={index}>
                      <td>{entry['Transaction Date']}</td>
                      <td>{entry['Account']}</td>
                      <td>{entry['Debit']}</td>
                      <td>{entry['Credit']}</td>
                      <td>{entry['Memo']}</td>
                      <td>{entry['Department']}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="text-xl font-bold mb-4">CSV Format Requirements</h2>
        <div className="alert alert-info">
          <p className="mb-2"><strong>Expected CSV columns:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Transaction Date</strong> or <strong>Date</strong> - The date of the transaction</li>
            <li><strong>Account</strong> or <strong>GL Account</strong> - The general ledger account</li>
            <li><strong>Debit</strong> - Debit amount (positive number)</li>
            <li><strong>Credit</strong> - Credit amount (positive number)</li>
            <li><strong>Amount</strong> - Alternative: positive for debit, negative for credit</li>
            <li><strong>Memo</strong>, <strong>Description</strong>, or <strong>Reference</strong> - Transaction description</li>
            <li><strong>Department</strong>, <strong>Class</strong>, <strong>Location</strong> - Optional classification fields</li>
            <li><strong>Currency</strong> - Currency code (defaults to USD)</li>
            <li><strong>Exchange Rate</strong> - Exchange rate (defaults to 1.0)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
