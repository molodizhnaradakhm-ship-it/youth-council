import escapeHTML from 'escape-html';
import { Text } from 'slate';

import { replaceDoubleCurlys } from './replaceDoubleCurlys';

type Node = {
  bold?: boolean;
  children?: Node[];
  code?: boolean;
  italic?: boolean;
  type?: string;
  url?: string;
};

export const serializeRichText = (children?: Node[], submissionData?: any): string | undefined =>
  children
    ?.map((node: Node) => {
      if (Text.isText(node)) {
        let text = `<span>${escapeHTML(replaceDoubleCurlys(node.text, submissionData))}</span>`;

        if (node.bold) {
          text = `
        <strong>
          ${text}
        </strong>
      `;
        }

        if (node.code) {
          text = `
        <code>
          ${text}
        </code>
      `;
        }

        if (node.italic) {
          text = `
        <em >
          ${text}
        </em>
      `;
        }

        return text;
      }

      if (!node) {
        return null;
      }

      switch (node.type) {
        case 'h1':
          return `
        <h1>
          ${serializeRichText(node.children, submissionData)}
        </h1>
      `;
        case 'h6':
          return `
        <h6>
          ${serializeRichText(node.children, submissionData)}
        </h6>
      `;
        case 'quote':
          return `
        <blockquote>
          ${serializeRichText(node.children, submissionData)}
        </blockquote>
      `;
        case 'ul':
          return `
        <ul>
          ${serializeRichText(node.children, submissionData)}
        </ul>
      `;
        case 'ol':
          return `
        <ol>
          ${serializeRichText(node.children, submissionData)}
        </ol>
      `;
        case 'li':
          return `
        <li>
          ${serializeRichText(node.children, submissionData)}
        </li>
      `;
        case 'indent':
          return `
          <p style="padding-left: 20px">
            ${serializeRichText(node.children, submissionData)}
          </p>
        `;
        case 'link':
          return `
        <a href={${escapeHTML(node.url)}}>
          ${serializeRichText(node.children, submissionData)}
        </a>
      `;

        default:
          return `
        <p>
          ${serializeRichText(node.children, submissionData)}
        </p>
     `;
      }
    })
    .filter(Boolean)
    .join('');
