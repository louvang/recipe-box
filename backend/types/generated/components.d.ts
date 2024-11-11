import type { Schema, Struct } from '@strapi/strapi';

export interface GeneralLink extends Struct.ComponentSchema {
  collectionName: 'components_general_links';
  info: {
    displayName: 'Link';
    icon: 'link';
  };
  attributes: {
    targetBlank: Schema.Attribute.Boolean;
    text: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface LayoutNavigationLink extends Struct.ComponentSchema {
  collectionName: 'components_layout_navigation_links';
  info: {
    description: '';
    displayName: 'Navigation Link';
    icon: 'link';
  };
  attributes: {
    position: Schema.Attribute.Integer;
    targetBlank: Schema.Attribute.Boolean;
    text: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface RecipeIngredients extends Struct.ComponentSchema {
  collectionName: 'components_recipe_ingredients';
  info: {
    description: '';
    displayName: 'Ingredient';
    icon: 'bulletList';
  };
  attributes: {
    Amount: Schema.Attribute.String;
    Ingredient: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'general.link': GeneralLink;
      'layout.navigation-link': LayoutNavigationLink;
      'recipe.ingredients': RecipeIngredients;
    }
  }
}
