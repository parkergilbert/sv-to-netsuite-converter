const express = require('express');
const cors = require('cors');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-app-name.herokuapp.com', 'https://your-vercel-app.vercel.app'] 
    : ['http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed!'), false);
    }
  }
});

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Transform CSV data to NetSuite journal entry format
function transformToJournalEntry(csvData) {
  const journalEntries = [];
  
  csvData.forEach((row, index) => {
    // Map CSV columns to NetSuite journal entry fields
    // You can customize this mapping based on your CSV structure
    const entry = {
      'Transaction Date': row['Transaction Date'] || row['Date'] || new Date().toISOString().split('T')[0],
      'Account': row['Account'] || row['GL Account'] || '',
      'Debit': row['Debit'] || (row['Amount'] && parseFloat(row['Amount']) > 0 ? Math.abs(parseFloat(row['Amount'])) : ''),
      'Credit': row['Credit'] || (row['Amount'] && parseFloat(row['Amount']) < 0 ? Math.abs(parseFloat(row['Amount'])) : ''),
      'Memo': row['Memo'] || row['Description'] || row['Reference'] || '',
      'Department': row['Department'] || '',
      'Class': row['Class'] || '',
      'Location': row['Location'] || '',
      'Currency': row['Currency'] || 'USD',
      'Exchange Rate': row['Exchange Rate'] || '1.0'
    };
    
    journalEntries.push(entry);
  });
  
  return journalEntries;
}

// Upload and process CSV endpoint
app.post('/api/upload-csv', upload.single('csvFile'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No CSV file uploaded' });
    }

    const csvData = [];
    const filePath = req.file.path;

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        csvData.push(row);
      })
      .on('end', () => {
        // Transform data to NetSuite format
        const journalEntries = transformToJournalEntry(csvData);
        
        // Clean up uploaded file
        fs.unlinkSync(filePath);
        
        res.json({
          message: 'CSV processed successfully',
          originalRowCount: csvData.length,
          journalEntries: journalEntries,
          sampleData: csvData.slice(0, 3) // Show first 3 rows for preview
        });
      })
      .on('error', (error) => {
        console.error('CSV parsing error:', error);
        fs.unlinkSync(filePath);
        res.status(500).json({ error: 'Error parsing CSV file' });
      });
      
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Error processing file' });
  }
});

// Export journal entries as CSV
app.post('/api/export-journal', (req, res) => {
  try {
    const { journalEntries } = req.body;
    
    if (!journalEntries || !Array.isArray(journalEntries)) {
      return res.status(400).json({ error: 'Invalid journal entries data' });
    }

    // Create CSV writer
    const csvWriter = createCsvWriter({
      path: 'temp-journal-export.csv',
      header: [
        { id: 'Transaction Date', title: 'Transaction Date' },
        { id: 'Account', title: 'Account' },
        { id: 'Debit', title: 'Debit' },
        { id: 'Credit', title: 'Credit' },
        { id: 'Memo', title: 'Memo' },
        { id: 'Department', title: 'Department' },
        { id: 'Class', title: 'Class' },
        { id: 'Location', title: 'Location' },
        { id: 'Currency', title: 'Currency' },
        { id: 'Exchange Rate', title: 'Exchange Rate' }
      ]
    });

    csvWriter.writeRecords(journalEntries)
      .then(() => {
        // Send the CSV file
        res.download('temp-journal-export.csv', 'netsuite-journal-entries.csv', (err) => {
          if (err) {
            console.error('Download error:', err);
          }
          // Clean up temp file
          fs.unlinkSync('temp-journal-export.csv');
        });
      })
      .catch(error => {
        console.error('CSV writing error:', error);
        res.status(500).json({ error: 'Error creating export file' });
      });
      
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Error exporting journal entries' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
