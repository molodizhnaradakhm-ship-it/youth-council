import clsx from 'clsx';

import type { TextProps, TextType } from '../Text';
import { serializeLexical } from './serialize';

type Props = {
  className?: string;

  content: Record<string, any>;
  textColor?: TextProps['color'];
  textType?: TextType;
  headingType?: TextType;
};

const RichText: React.FC<Props> = ({ className, content, textColor, textType, headingType }) => {
  if (!content) {
    return null;
  }

  return (
    <div className={clsx(className)}>
      {content &&
        !Array.isArray(content) &&
        typeof content === 'object' &&
        'root' in content &&
        serializeLexical({ nodes: content?.root?.children, textColor, textType, headingType })}
    </div>
  );
};

export default RichText;
