import type { Schema, Attribute } from '@strapi/strapi';

export interface LayoutHero extends Schema.Component {
  collectionName: 'components_layout_heroes';
  info: {
    displayName: 'Hero';
    description: '';
  };
  attributes: {
    imageBackground: Attribute.Media;
    heading: Attribute.String;
    text: Attribute.String;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'layout.hero': LayoutHero;
    }
  }
}
