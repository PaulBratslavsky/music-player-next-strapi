import type { Schema, Struct } from '@strapi/strapi';

export interface LayoutFeature extends Struct.ComponentSchema {
  collectionName: 'components_layout_features';
  info: {
    description: '';
    displayName: 'Feature';
  };
  attributes: {
    href: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    linkText: Schema.Attribute.String;
    text: Schema.Attribute.String;
  };
}

export interface LayoutFeaturesList extends Struct.ComponentSchema {
  collectionName: 'components_layout_features_lists';
  info: {
    displayName: 'FeaturesList';
  };
  attributes: {
    description: Schema.Attribute.Text;
    feature: Schema.Attribute.Component<'layout.feature', true>;
    title: Schema.Attribute.String;
  };
}

export interface LayoutHero extends Struct.ComponentSchema {
  collectionName: 'components_layout_heroes';
  info: {
    description: '';
    displayName: 'Hero';
  };
  attributes: {
    heading: Schema.Attribute.String;
    imageBackground: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    link: Schema.Attribute.Component<'layout.link', false>;
    text: Schema.Attribute.String;
  };
}

export interface LayoutLink extends Struct.ComponentSchema {
  collectionName: 'components_layout_links';
  info: {
    displayName: 'Link';
  };
  attributes: {
    href: Schema.Attribute.String;
    text: Schema.Attribute.String;
    type: Schema.Attribute.Enumeration<['PRIMARY', 'SECONDARY']>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'layout.feature': LayoutFeature;
      'layout.features-list': LayoutFeaturesList;
      'layout.hero': LayoutHero;
      'layout.link': LayoutLink;
    }
  }
}
