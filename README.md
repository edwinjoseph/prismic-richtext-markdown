# Prismic RichText Markdown

**NOTE: This package only supports Prismic API V2, you may use this if you are using V1 but will need to remap the richtext blob being passed in. Although this is not advised.**

This is a method that converts the data that comes from Prismic's RichText field into a markdown string.

### Supported options

- [x] Heading 1-6
- [x] Bold
- [x] Italics
- [x] Images
- [x] Link to web
- [x] Link to media
- [x] Link to document
- [x] Ordered lists
- [x] Unordered lists
- [x] Preformated
- [ ] Embedded
- [ ] Right to left

### Confirmed markdown packages that work with this
It is most likely that this method works with most markdown packages, however I have only tested this with:
- [x] [markdown-it](https://www.npmjs.com/package/markdown-it)

## Usage
### Example Prismic document
```
{
  "id": "WKxlPCUEEIZ10AHU",
  "uid": "example-page",
  "type": "page",
  "href": "https://your-repo-name.prismic.io/api/documents/search...",
  "tags": [],
  "first_publication_date": "2017-01-13T11:45:21.000Z",
  "last_publication_date": "2017-02-21T16:05:19.000Z",
  "slugs": [
    "example-page"
  ],
  "linked_documents": [],
  "lang": "en-us",
  "alternate_languages": [...],
  "data": {
    "title": [
      {
        "type": "heading1",
        "text": "Example Page",
        "spans": []
      }
    ]
  }
}
```

### Handling rich text
```js
import MarkdownIt from 'markdown-it';
import richTextToMarkdown from '@edwinjoseph/prismic-richtext-markdown';

// resolver function example from https://prismic.io/docs/javascript/beyond-the-api/link-resolving
const linkResolver = (doc) => {
  // Pretty URLs for known types
  if (doc.type === 'blog') return "/post/" + doc.uid;
  if (doc.type === 'page') return "/" + doc.uid;
  // Fallback for other types, in case new custom types get created
  return "/doc/" + doc.id;
};

const md = new MarkdownIt();

const mkdown = richTextToMarkdown(document.data.title, linkResolver);
const result = md.render(mkdown);
// => <h1>Example Page</h1>
```
