import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Components } from 'react-markdown';

export const markdownComponents: Components = {
  // Custom Image component using Next.js Image
  img: ({ src, alt, ...props }) => {
    if (!src || typeof src !== 'string') return null;

    // Check if it's an external image
    const isExternal = src.startsWith('http://') || src.startsWith('https://');
    
    // For external images, use regular img tag
    if (isExternal) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt || ''} {...props} />
      );
    }

    return (
      <span className="block my-8 relative w-full">
        <Image
          src={src}
          alt={alt || ''}
          width={800}
          height={600}
          className="rounded-lg w-full h-auto"
          style={{ objectFit: 'contain' }}
          loading="lazy"
        />
        {alt && (
          <span className="block text-center text-sm text-gray-600 italic mt-2">
            {alt}
          </span>
        )}
      </span>
    );
  },

  // Custom Link component using Next.js Link for internal links
  a: ({ href, children, ...props }) => {
    if (!href) return <a {...props}>{children}</a>;

    // Check if it's an external link
    const isExternal = href.startsWith('http://') || href.startsWith('https://');
    const isAnchor = href.startsWith('#');

    if (isExternal || isAnchor) {
      return (
        <a 
          href={href} 
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          {...props}
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  },

  // Custom headings with anchor links
  h1: ({ children, ...props }) => {
    const id = typeof children === 'string' 
      ? children.toLowerCase().replaceAll(/[^\w]+/g, '-') 
      : undefined;
    return <h1 id={id} {...props}>{children}</h1>;
  },
  h2: ({ children, ...props }) => {
    const id = typeof children === 'string' 
      ? children.toLowerCase().replaceAll(/[^\w]+/g, '-') 
      : undefined;
    return <h2 id={id} {...props}>{children}</h2>;
  },
  h3: ({ children, ...props }) => {
    const id = typeof children === 'string' 
      ? children.toLowerCase().replaceAll(/[^\w]+/g, '-') 
      : undefined;
    return <h3 id={id} {...props}>{children}</h3>;
  },

  // Enhanced code blocks
  code: ({ className, children, ...props }) => {
    const isInline = !className;
    
    if (isInline) {
      return (
        <code 
          className="px-1.5 py-0.5 rounded bg-gray-100 text-sm font-mono text-gray-800 border border-gray-200" 
          {...props}
        >
          {children}
        </code>
      );
    }
    
    return <code className={className} {...props}>{children}</code>;
  },

  // Enhanced blockquotes
  blockquote: ({ children, ...props }) => (
    <blockquote 
      className="border-l-4 border-blue-500 pl-4 my-4 italic text-gray-700 bg-gray-50 py-2 rounded-r"
      {...props}
    >
      {children}
    </blockquote>
  ),

  // Enhanced tables
  table: ({ children, ...props }) => (
    <div className="overflow-x-auto my-8">
      <table className="min-w-full divide-y divide-gray-300" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead className="bg-gray-50" {...props}>{children}</thead>
  ),
  tbody: ({ children, ...props }) => (
    <tbody className="divide-y divide-gray-200 bg-white" {...props}>{children}</tbody>
  ),
  th: ({ children, ...props }) => (
    <th 
      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900" 
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700" {...props}>
      {children}
    </td>
  ),

  // Enhanced lists
  ul: ({ children, ...props }) => (
    <ul className="list-disc list-outside ml-6 my-4 space-y-2" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="list-decimal list-outside ml-6 my-4 space-y-2" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="text-gray-700" {...props}>{children}</li>
  ),

  // Horizontal rule
  hr: (props) => <hr className="my-8 border-gray-300" {...props} />,

  // Paragraphs
  p: ({ children, ...props }) => {
    // Check if paragraph only contains an image (already wrapped)
    const hasOnlyImage = React.Children.toArray(children).every(
      child => typeof child === 'object' && child !== null && 'type' in child && child.type === 'span'
    );
    
    if (hasOnlyImage) {
      return <>{children}</>;
    }
    
    return <p className="my-4 leading-7" {...props}>{children}</p>;
  },
};

// For handling italic text that might be used as image captions
// This is a helper to detect if content after image is caption-like
export function isImageCaption(text: string): boolean {
  return text.trim().length < 100 && !text.includes('\n');
}

