import React from 'react';
import type { ReactPlayerProps } from 'react-player';
import ReactPlayer from 'react-player';

export const RenderPlayer: React.FC<ReactPlayerProps> = (props) => <ReactPlayer {...props} />;
