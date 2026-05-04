import type { Block } from 'payload';

/**
 * Features bento block (home section).
 */
export const FeaturesBentoBlock: Block = {
  fields: [
    {
      admin: { description: 'Optional. Leave empty if the section should only show label / description / cells.' },
      label: 'Title',
      localized: true,
      name: 'title',
      required: false,
      type: 'text',
    },
    {
      label: 'Description',
      localized: true,
      name: 'description',
      required: false,
      type: 'textarea',
    },
    {
      fields: [
        {
          admin: { description: 'Column width in the bento grid.' },
          defaultValue: '50',
          label: 'Column width',
          name: 'width',
          options: [
            { label: '25%', value: '25' },
            { label: '50%', value: '50' },
            { label: '75%', value: '75' },
            { label: '100%', value: '100' },
          ],
          required: true,
          type: 'select',
        },
        {
          fields: [
            {
              label: 'Kicker / label',
              localized: true,
              name: 'kicker',
              required: false,
              type: 'text',
            },
            {
              label: 'Card description',
              localized: true,
              name: 'description',
              required: false,
              type: 'textarea',
            },
            {
              label: 'Image',
              name: 'image',
              relationTo: 'media',
              localized: true,
              required: true,
              type: 'upload',
            },
            {
              admin: {
                description:
                  'Content area: image below text (CSS background in the media block). Full card: image as background behind the whole card — position/fit from the fields below.',
              },
              defaultValue: 'content',
              label: 'Image placement',
              name: 'imageLayer',
              options: [
                { label: 'Below text (image area)', value: 'content' },
                { label: 'Full card background', value: 'cardBackground' },
              ],
              required: false,
              type: 'select',
            },
            {
              admin: {
                description: 'How the image fits inside the area (contain = full image; cover = fill, may crop).',
              },
              defaultValue: 'contain',
              label: 'Image fit',
              name: 'imageObjectFit',
              options: [
                { label: 'Contain', value: 'contain' },
                { label: 'Cover', value: 'cover' },
              ],
              required: false,
              type: 'select',
            },
            {
              admin: {
                description: 'Focal point when using Cover, or alignment for Contain.',
              },
              defaultValue: 'bottom-center',
              label: 'Image position',
              name: 'imageObjectPosition',
              options: [
                { label: 'Bottom center', value: 'bottom-center' },
                { label: 'Center', value: 'center' },
                { label: 'Top center', value: 'top-center' },
                { label: 'Left center', value: 'left-center' },
                { label: 'Right center', value: 'right-center' },
                { label: 'Bottom left', value: 'bottom-left' },
                { label: 'Bottom right', value: 'bottom-right' },
                { label: 'Top left', value: 'top-left' },
                { label: 'Top right', value: 'top-right' },
              ],
              required: false,
              type: 'select',
            },
            {
              admin: {
                description: 'Max width of the image inside the card (rest is empty space).',
              },
              defaultValue: '100',
              label: 'Image width',
              name: 'imageWidthPercent',
              options: [
                { label: '100%', value: '100' },
                { label: '90%', value: '90' },
                { label: '80%', value: '80' },
                { label: '70%', value: '70' },
                { label: '60%', value: '60' },
                { label: '50%', value: '50' },
              ],
              required: false,
              type: 'select',
            },
            {
              admin: {
                description:
                  'Fixed aspect ratio for the image area (stabilizes layout). Auto = flexible height from content.',
              },
              defaultValue: 'auto',
              label: 'Image area aspect ratio',
              name: 'imageAreaAspectRatio',
              options: [
                { label: 'Auto', value: 'auto' },
                {
                  label: 'Fill card — image area uses remaining width & height in the card',
                  value: 'fill',
                },
                { label: '1:1', value: '1:1' },
                { label: '4:3', value: '4:3' },
                { label: '3:4', value: '3:4' },
                { label: '16:9', value: '16:9' },
                { label: '21:9', value: '21:9' },
                { label: '3:2', value: '3:2' },
              ],
              required: false,
              type: 'select',
            },
            {
              admin: {
                description:
                  'Optional min-height for this card. Default = CSS for the chosen preset. Custom = exact min-height in px.',
              },
              defaultValue: 'default',
              label: 'Card height',
              name: 'heightPreset',
              options: [
                { label: 'Default', value: 'default' },
                { label: 'Square', value: 'square' },
                { label: 'Rectangle', value: 'rect' },
                { label: 'Rectangle (long)', value: 'rectLong' },
                { label: 'Compact', value: 'compact' },
                { label: 'Medium', value: 'medium' },
                { label: 'Tall', value: 'tall' },
                { label: 'Extra tall', value: 'extraTall' },
                { label: 'Custom (px)', value: 'custom' },
              ],
              required: false,
              type: 'select',
            },
            {
              admin: {
                condition: (_data: any, siblingData: any) => siblingData?.heightPreset === 'custom',
                description: 'Minimum height of the card in pixels (applied as min-height).',
              },
              label: 'Custom min height (px)',
              max: 1200,
              min: 80,
              name: 'heightCustomPx',
              required: false,
              type: 'number',
            },
            {
              admin: { description: 'Background tone for the card.' },
              defaultValue: 'lightGreen',
              label: 'Tone',
              name: 'tone',
              options: [
                { label: 'Dark green', value: 'darkGreen' },
                { label: 'Light green', value: 'lightGreen' },
                { label: 'Grey', value: 'grey' },
              ],
              required: true,
              type: 'select',
            },
          ],
          label: 'Cards',
          labels: { plural: 'Cards', singular: 'Card' },
          minRows: 1,
          name: 'cards',
          required: true,
          type: 'array',
        },
      ],
      label: 'Columns',
      labels: { plural: 'Columns', singular: 'Column' },
      minRows: 1,
      name: 'columns',
      required: true,
      type: 'array',
    },
  ],
  interfaceName: 'FeaturesBentoBlockFields',
  labels: { plural: 'Features (bento)', singular: 'Features (bento)' },
  slug: 'features-bento-block',
};

