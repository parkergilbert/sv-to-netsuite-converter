# CSV to NetSuite Journal Converter

A web application that transforms CSV data into NetSuite journal entry format. Upload your CSV file, and the app will automatically convert it into the proper format for importing into NetSuite.

## Features

- **Drag & Drop CSV Upload**: Easy file upload with drag-and-drop interface
- **Automatic Data Transformation**: Converts CSV data to NetSuite journal entry format
- **Preview Results**: See a preview of the transformed data before exporting
- **Download Ready**: Export the transformed data as a CSV file ready for NetSuite import
- **Flexible Column Mapping**: Supports various CSV column naming conventions

## Prerequisites

Before running this application, you need to install:

1. **Node.js** (version 14 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Or install via Homebrew: `brew install node`

2. **npm** (comes with Node.js)

## Installation

1. **Install dependencies for all parts of the application:**
   ```bash
   npm run install-all
   ```

   This will install dependencies for:
   - Root project (concurrently for running both servers)
   - Backend server (Express.js with CSV processing)
   - Frontend client (React with TypeScript)

## Running the Application

1. **Start both frontend and backend servers:**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on http://localhost:5000
   - Frontend React app on http://localhost:3000

2. **Open your browser** and navigate to http://localhost:3000

## Usage

1. **Upload CSV File**: 
   - Drag and drop your CSV file onto the upload area
   - Or click to browse and select a file

2. **Process File**: 
   - Click "Process File" to transform your data
   - The app will show processing results and a preview

3. **Export Journal Entries**: 
   - Click "Download NetSuite Journal CSV" to get the transformed file
   - The exported file is ready for NetSuite import

## CSV Format Requirements

Your CSV file should contain columns that map to NetSuite journal entry fields:

### Required Fields
- **Transaction Date** (or "Date") - Transaction date
- **Account** (or "GL Account") - General ledger account
- **Amount** - Transaction amount (positive = debit, negative = credit)

### Alternative Amount Fields
- **Debit** - Debit amount (positive number)
- **Credit** - Credit amount (positive number)

### Optional Fields
- **Memo** (or "Description" or "Reference") - Transaction description
- **Department** - Department classification
- **Class** - Class classification  
- **Location** - Location classification
- **Currency** - Currency code (defaults to USD)
- **Exchange Rate** - Exchange rate (defaults to 1.0)

## Example CSV Format

```csv
Transaction Date,Account,Debit,Credit,Memo,Department
2024-01-15,1000 - Cash,1000,,Office Supplies Purchase,Operations
2024-01-15,5000 - Office Supplies,,1000,Office Supplies Purchase,Operations
2024-01-16,2000 - Accounts Receivable,500,,Service Revenue,Operations
2024-01-16,4000 - Service Revenue,,500,Service Revenue,Operations
```

## API Endpoints

- `POST /api/upload-csv` - Upload and process CSV file
- `POST /api/export-journal` - Export journal entries as CSV
- `GET /api/health` - Health check endpoint

## Project Structure

```
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── App.tsx        # Main application component
│   │   ├── index.tsx      # React entry point
│   │   └── index.css      # Global styles
│   └── package.json
├── server/                # Express backend
│   ├── index.js          # Server entry point
│   └── package.json
├── package.json          # Root package.json
└── README.md
```

## Development

### Running Individual Components

- **Backend only**: `npm run server`
- **Frontend only**: `npm run client`
- **Build for production**: `npm run build`

### Customization

You can customize the CSV column mapping by modifying the `transformToJournalEntry` function in `server/index.js`.

## Troubleshooting

1. **Port already in use**: Change the PORT in `server/index.js` or kill the process using the port
2. **CORS errors**: Ensure the frontend is running on port 3000 and backend on port 5000
3. **File upload issues**: Check that the uploaded file is a valid CSV format

## License

MIT License
