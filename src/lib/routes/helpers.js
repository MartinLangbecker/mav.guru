import { h } from 'hastscript';
import { u } from 'unist-builder';
import { toHtml } from 'hast-util-to-html';

export const formatPrice = (amount) => {
  const parts = amount.toFixed(2).toString().split('.');
  return { euros: parts[0], cents: parts[1] };
};

export const opengraph = ({ api, extraTitle }) => {
  let title = api.settings.ogTitle;
  if (extraTitle) title += ` - ${extraTitle}`;
  return [
    h('meta', { property: 'og:title', content: title }),
    h('meta', {
      property: 'og:description',
      content: api.settings.ogDescription,
    }),
    h('meta', { property: 'og:image', content: api.settings.ogImage }),
    h('meta', { name: 'twitter:card', content: 'summary' }),
  ];
};

export const staticHeader = (api) => {
  const header = [
    h('meta', { charset: 'utf-8' }),
    h('meta', { name: 'description', content: api.settings.description }),
    h('meta', {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1.0',
    }),
    h('link', {
      rel: 'stylesheet',
      type: 'text/css',
      href: '/assets/styles/reset.css',
    }),
    h('link', {
      rel: 'stylesheet',
      type: 'text/css',
      href: '/assets/styles/base.css',
    }),
  ];
  for (const style of api.settings.styles) {
    header.push(
      h('link', {
        rel: 'stylesheet',
        type: 'text/css',
        href: `/assets/styles/${style}`,
      })
    );
  }

  if (api.settings.icon) {
    header.push(
      h('link', {
        rel: 'icon',
        type: 'image/png',
        href: `/assets/${api.settings.icon}`,
      })
    );
  }

  return header;
};

export const toHtmlString = (elements) =>
  toHtml(h(undefined, u('doctype'), h('html', elements)));

/**
 * clean string for easier comparison
 * @param {string} str string to clean
 * @returns cleaned string
 */
export const cleanStr = (str) => str.toLowerCase().trim();
