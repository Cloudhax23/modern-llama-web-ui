import React, { useState, useRef } from 'react';
import 'highlight.js/styles/github-dark.css';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const CodeBox: React.FC<{ code: string, language: string }> = ({ code, language }) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const codeRef = useRef<HTMLPreElement>(null);

  const copyToClipboard = () => {
    if (codeRef.current) {
      navigator.clipboard.writeText(codeRef.current.textContent || '').then(() => {
        setOpenSnackbar(true);
      }, (err) => {
        console.error('Could not copy text: ', err);
      });
    }
  };

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Paper elevation={3} sx={{ margin: '10px', borderRadius: '5px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', padding: '5px 10px', borderTopLeftRadius: '4px', borderTopRightRadius: '4px', borderBottom: '1px solid #ccc' }}>
        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
          {language}
        </Typography>
        <IconButton onClick={copyToClipboard} size="small">
          <ContentCopyIcon fontSize="small" />
        </IconButton>
      </Box>
      <Box component="pre" sx={{ margin: '0', padding: '10px', overflowX: 'auto', borderBottomLeftRadius: '4px', borderBottomRightRadius: '4px'}}>
        <code ref={codeRef} dangerouslySetInnerHTML={{ __html: code }} />
      </Box>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Code copied to clipboard!
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default CodeBox;
