import React, { useEffect, useState } from 'react';
import { Message as MessageType } from '../types';
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';
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
    const parseMarkdown = async (markdownText: string) => {
      const marked = getMarked();
      const rawMarkup = marked.parse(markdownText);
      let sanitizedMarkup = '';
      if (typeof rawMarkup === 'string') {
        sanitizedMarkup = DOMPurify.sanitize(rawMarkup);
      } else {
        sanitizedMarkup = DOMPurify.sanitize(await rawMarkup);
      }
    
      const segments = sanitizedMarkup.split(/(<pre><code class="hljs language-.*?">[\s\S]*?<\/code><\/pre>)/);
    
      const contentElements = segments.map((segment, index) => {
        const codeBlockRegex = /<pre><code class="hljs language-(.*?)">([\s\S]*?)<\/code><\/pre>/;
        const match = codeBlockRegex.exec(segment);
    
        if (match) {
          const [ , language, code ] = match;
          return <CodeBox key={`codeblock-${index}`} code={code} language={language} />;
        } else {
          return <span key={`textblock-${index}`} dangerouslySetInnerHTML={{ __html: segment }} />;
        }
      });
    
      setContent(<div>{contentElements}</div>);
    };

    if (message.author === 'You') {
      setContent(<div>{message.content}</div>);
    } else {
      parseMarkdown(message.content);
    }
  }, [message.content, message.author]);

  return (
    <Box>
      <Typography component="span" sx={{ fontWeight: 'fontWeightBold' }}>
        {message.author}:
      </Typography>
      <Box
        className={`content ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
        sx={{ whiteSpace: 'pre-wrap' }}
      >
        {content}
      </Box>
    </Box>
  );
};

export default Message;
