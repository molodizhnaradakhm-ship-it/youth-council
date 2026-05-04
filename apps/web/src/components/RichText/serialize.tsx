import type { JSX } from 'react';
import React, { Fragment } from 'react';

import type { DefaultNodeTypes } from '@monorepo/cms/node_modules/@payloadcms/richtext-lexical';
import type { Media } from '@monorepo/cms/src/payload-types';

import { CMSLink } from '../CMSLink';
import { CMSMedia } from '../CMSMedia';
import type { TextProps, TextType } from '../Text';
import { Text } from '../Text';
import {
  IS_BOLD,
  IS_CODE,
  IS_ITALIC,
  IS_STRIKETHROUGH,
  IS_SUBSCRIPT,
  IS_SUPERSCRIPT,
  IS_UNDERLINE,
} from './nodeFormat';

import styles from './RichText.module.scss';

export type NodeTypes =
  | DefaultNodeTypes
  | {
      type: 'table';
      children: NodeTypes[];
    }
  | {
      type: 'tablerow';
      children: NodeTypes[];
    }
  | {
      type: 'tablecell';
      headerState?: number;
      children: NodeTypes[];
    };

type Props = {
  nodes: NodeTypes[];
  textType?: TextType;
  headingType?: TextType;
  textColor?: TextProps['color'];
};

export function serializeLexical({
  nodes,
  textColor,
  textType = 'p1',
  headingType = 'h5',
}: Props): JSX.Element {
  return (
    <Fragment>
      {nodes?.map((node, index): JSX.Element | null => {
        if (node == null) {
          return null;
        }

        if (node.type === 'text') {
          let text = <React.Fragment key={index}>{node.text}</React.Fragment>;

          if (node.format & IS_BOLD) {
            text = <strong key={index}>{text}</strong>;
          }
          if (node.format & IS_ITALIC) {
            text = <em key={index}>{text}</em>;
          }
          if (node.format & IS_STRIKETHROUGH) {
            text = (
              <span key={index} style={{ textDecoration: 'line-through' }}>
                {text}
              </span>
            );
          }
          if (node.format & IS_UNDERLINE) {
            text = (
              <span key={index} style={{ textDecoration: 'underline' }}>
                {text}
              </span>
            );
          }
          if (node.format & IS_CODE) {
            text = <code key={index}>{node.text}</code>;
          }
          if (node.format & IS_SUBSCRIPT) {
            text = <sub key={index}>{text}</sub>;
          }
          if (node.format & IS_SUPERSCRIPT) {
            text = <sup key={index}>{text}</sup>;
          }

          return text;
        }

        // NOTE: Hacky fix for
        // https://github.com/facebook/lexical/blob/d10c4e6e55261b2fdd7d1845aed46151d0f06a8c/packages/lexical-list/src/LexicalListItemNode.ts#L133
        // which does not return checked: false (only true - i.e. there is no prop for false)
        const serializedChildrenFn = (node: any): JSX.Element | null => {
          if (node.children == null) {
            return null;
          } else {
            if (node?.type === 'list' && node?.listType === 'check') {
              for (const item of node.children) {
                if ('checked' in item) {
                  if (!item?.checked) {
                    item.checked = false;
                  }
                }
              }
            }

            return serializeLexical({ nodes: node.children as NodeTypes[], textColor, textType });
          }
        };

        const serializedChildren = 'children' in node ? serializedChildrenFn(node) : '';

        switch (node.type) {
          case 'linebreak': {
            return <br className='col-start-2' key={index} />;
          }

          case 'paragraph': {
            return (
              <Text key={index} tag='p' type={textType} color={textColor}>
                {serializedChildren}
              </Text>
            );
          }

          case 'heading': {
            const tag = node?.tag;
            const typeForHeading = tag === 'h3' ? 'p1' : headingType;

            return (
              <Text
                tag={tag}
                type={typeForHeading}
                color={textColor}
                className='col-start-2'
                key={index}
              >
                {serializedChildren}
              </Text>
            );
          }
          case 'list': {
            const Tag = node?.tag;

            return <Tag key={index}>{serializedChildren}</Tag>;
          }
          case 'listitem': {
            if (node?.checked != null) {
              return (
                <li
                  aria-checked={node.checked ? 'true' : 'false'}
                  className={` ${node.checked ? '' : ''}`}
                  key={index}
                  role='checkbox'
                  tabIndex={-1}
                  value={node?.value}
                >
                  <Text tag='span' type={textType} color={textColor}>
                    {serializedChildren}
                  </Text>
                </li>
              );
            } else {
              return (
                <li key={index} value={node?.value}>
                  <Text tag='span' type={textType} color={textColor}>
                    {serializedChildren}
                  </Text>
                </li>
              );
            }
          }
          case 'quote': {
            return (
              <Text type='h4' key={index} color={textColor} tag='blockquote'>
                {serializedChildren}
              </Text>
            );
          }
          case 'link': {
            const fields = node.fields;

            const linkTypes = fields.linkType === 'internal' ? 'reference' : 'custom';

            return (
              <CMSLink key={index} {...fields} type={linkTypes} reference={fields.doc as any}>
                {serializedChildren}
              </CMSLink>
            );
          }

          case 'upload': {
            return <CMSMedia key={index} resource={node.value as Media} />;
          }

          case 'table': {
            return (
              <div className={styles.tableScroll} key={index}>
                <table>
                  <tbody>{serializedChildren}</tbody>
                </table>
              </div>
            );
          }

          case 'tablerow': {
            return <tr key={index}>{serializedChildren}</tr>;
          }

          case 'tablecell': {
            const Tag = node?.headerState === 1 ? 'th' : 'td';
            return <Tag key={index}>{serializedChildren}</Tag>;
          }

          default:
            return null;
        }
      })}
    </Fragment>
  );
}
