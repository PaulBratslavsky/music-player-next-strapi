import type { Schema, Attribute } from '@strapi/strapi';

export interface LayoutFeature extends Schema.Component {
  collectionName: 'components_layout_features';
  info: {
    displayName: 'Feature';
    description: '';
  };
  attributes: {
    text: Attribute.String;
    image: Attribute.Media;
    linkText: Attribute.String;
    href: Attribute.String;
  };
}

export interface LayoutFeaturesList extends Schema.Component {
  collectionName: 'components_layout_features_lists';
  info: {
    displayName: 'FeaturesList';
  };
  attributes: {
    title: Attribute.String;
    description: Attribute.Text;
    feature: Attribute.Component<'layout.feature', true>;
  };
}

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
    link: Attribute.Component<'layout.link'>;
  };
}

export interface LayoutLink extends Schema.Component {
  collectionName: 'components_layout_links';
  info: {
    displayName: 'Link';
  };
  attributes: {
    text: Attribute.String;
    href: Attribute.String;
    type: Attribute.Enumeration<['PRIMARY', 'SECONDARY']>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'layout.feature': LayoutFeature;
      'layout.features-list': LayoutFeaturesList;
      'layout.hero': LayoutHero;
      'layout.link': LayoutLink;
    }
  }
}
