import React, { useEffect, useState } from 'react';
import { Message as MessageType } from '../types';
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css'
import 'highlight.js/styles/github-dark.css'
import CodeBox from './CodeBox';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

const getMarked = () => {
  return new Marked(
    markedHighlight({
      langPrefix: 'hljs language-',
      highlight(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
      }
    })
  );
};

const Message: React.FC<{ message: MessageType }> = ({ message }) => {
  const [content, setContent] = useState<React.ReactNode>('');
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  useEffect(() => {
    const marked = getMarked();
    const parseMarkdown = async (markdownText: string) => {
      const rawMarkup = marked.parse(markdownText);
      let sanitizedMarkup = '';
      if (typeof rawMarkup === 'string') {
        sanitizedMarkup = DOMPurify.sanitize(rawMarkup);
      } else {
        sanitizedMarkup = DOMPurify.sanitize(await rawMarkup);
      }

      // Check for code block pattern
      const codeBlockRegex = /<pre><code class="hljs language-(.*?)">([\s\S]*?)<\/code><\/pre>/;
      const match = codeBlockRegex.exec(sanitizedMarkup);
      if (match) {
        const language = match[1];
        const code = match[2];
        // Use your CodeBox component for rendering code
        setContent(<CodeBox code={code} language={language} />);
      } else {
        setContent(<span dangerouslySetInnerHTML={{ __html: sanitizedMarkup }} />);
      }
    };

    parseMarkdown(message.content);
  }, [message.content]);

  return (
    <Box>
      <Typography component="span" sx={{ fontWeight: 'fontWeightBold' }}>
        {message.author}:
      </Typography>
      <span className={`content ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
        {content}
      </span>
    </Box>
  );
};

export default Message;
