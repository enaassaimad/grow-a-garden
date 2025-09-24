import React from 'react';

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  if (!content) {
    return null;
  }

  // FIX: Implemented a more robust parser to handle lists and paragraphs correctly.
  const renderContent = () => {
    let html = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
      .replace(/\*(.*?)\*/g, '<em>$1</em>');       // Italic

    const lines = html.split('\n');
    let inList = false;
    const resultLines = lines.map(line => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('- ')) {
        const listItem = `<li>${trimmedLine.substring(2).trim()}</li>`;
        if (!inList) {
          inList = true;
          return `<ul class="list-disc ml-5 space-y-1">${listItem}`;
        }
        return listItem;
      } else {
        if (inList) {
          inList = false;
          // If the line is empty, just close the list. If not, close it and add the line.
          return `</ul>` + (trimmedLine.length > 0 ? `<p>${line}</p>` : '');
        }
        // Don't wrap empty lines in <p> tags
        return trimmedLine.length > 0 ? `<p>${line}</p>` : '';
      }
    });

    if (inList) {
      resultLines.push('</ul>');
    }
    
    // Join without <br> because we are using <p>
    const finalHtml = resultLines.join('');
      
    return { __html: finalHtml };
  };

  return (
    <div
      className="prose prose-sm max-w-none text-[color:var(--foreground)] prose-strong:text-[color:var(--card-foreground)] prose-em:text-[color:var(--card-foreground)] [&_p]:mb-2 [&_ul]:mb-2"
      dangerouslySetInnerHTML={renderContent()}
    />
  );
};

export default MarkdownRenderer;
