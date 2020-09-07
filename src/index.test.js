import richTextToMarkdown from "./index";

describe("index.js", () => {
  describe("#richTextToMarkdown", () => {
    it("converts headings", () => {
      const h1 = [
        {
          text: "This is a h1 tag",
          type: "heading1",
          spans: []
        }
      ];
      const h2 = [
        {
          text: "This is a h2 tag",
          type: "heading2",
          spans: []
        }
      ];
      const h3 = [
        {
          text: "This is a h3 tag",
          type: "heading3",
          spans: []
        }
      ];
      const h4 = [
        {
          text: "This is a h4 tag",
          type: "heading4",
          spans: []
        }
      ];
      const h5 = [
        {
          text: "This is a h5 tag",
          type: "heading5",
          spans: []
        }
      ];
      const h6 = [
        {
          text: "This is a h6 tag",
          type: "heading6",
          spans: []
        }
      ];

      expect(richTextToMarkdown(h1)).toBe("# This is a h1 tag");
      expect(richTextToMarkdown(h2)).toBe("## This is a h2 tag");
      expect(richTextToMarkdown(h3)).toBe("### This is a h3 tag");
      expect(richTextToMarkdown(h4)).toBe("#### This is a h4 tag");
      expect(richTextToMarkdown(h5)).toBe("##### This is a h5 tag");
      expect(richTextToMarkdown(h6)).toBe("###### This is a h6 tag");
    });
    it("converts images", () => {
      const image = [
        {
          type: "image",
          url: "someurl",
          alt: null
        }
      ];
      const imageWithAlt = [
        {
          type: "image",
          url: "someurl",
          alt: "an alternate string"
        }
      ];

      expect(richTextToMarkdown(image)).toBe("![](someurl)");
      expect(richTextToMarkdown(imageWithAlt)).toBe("![an alternate string](someurl)");
    });
    it("converts paragraphs with emphasis", () => {
      const bold = [
        {
          text: "This is a bold string",
          type: "paragraph",
          spans: [
            {
              start: 0,
              end: 21,
              type: "strong"
            }
          ]
        }
      ];
      const italic = [
        {
          text: "This is an italic string",
          type: "paragraph",
          spans: [
            {
              start: 0,
              end: 25,
              type: "em"
            }
          ]
        }
      ];
      const boldItalic = [
        {
          text: "This part is bold and this part is italic",
          type: "paragraph",
          spans: [
            {
              start: 0,
              end: 17,
              type: "strong"
            },
            {
              start: 18,
              end: 41,
              type: "em"
            }
          ]
        }
      ];
      const boldItalicBold = [
        {
          text:
            "This part is bold, this part is italic, and now it is bold again",
          type: "paragraph",
          spans: [
            {
              start: 0,
              end: 17,
              type: "strong"
            },
            {
              start: 19,
              end: 38,
              type: "em"
            },
            {
              start: 40,
              end: 64,
              type: "strong"
            }
          ]
        }
      ];
      const boldAndItalic = [
        {
          text: "This is both bold and italic",
          type: "paragraph",
          spans: [
            {
              start: 0,
              end: 28,
              type: "strong"
            },
            {
              start: 0,
              end: 28,
              type: "em"
            }
          ]
        }
      ];

      expect(richTextToMarkdown(bold)).toBe("**This is a bold string**");
      expect(richTextToMarkdown(italic)).toBe("*This is an italic string*");
      expect(richTextToMarkdown(boldItalic)).toBe("**This part is bold** *and this part is italic*");
      expect(richTextToMarkdown(boldItalicBold)).toBe("**This part is bold**, *this part is italic*, **and now it is bold again**");
      expect(richTextToMarkdown(boldAndItalic)).toBe("***This is both bold and italic***");
    });
    it("converts paragraphs with urls", () => {
      const url = [
        {
          text: "This is some text with a link to google, followed by more text",
          type: "paragraph",
          spans: [
            {
              start: 18,
              end: 39,
              type: "hyperlink",
              data: {
                link_type: "Web",
                url: "https://google.com"
              }
            }
          ]
        }
      ];
      const imageUrl = [
        {
          text: "This is some text with a link to a media item",
          type: "paragraph",
          spans: [
            {
              start: 18,
              end: 45,
              type: "hyperlink",
              data: {
                link_type: "Media",
                url: "https://images.prismic.io/slicemachine-blank/6b2bf485-aa12-44ef-8f06-dce6b91b9309_dancing.png?auto=compress,format"
              }
            }
          ]
        }
      ];
      const documentUrl = [
        {
          text: "This is some text with a link to a document",
          type: "paragraph",
          spans: [
            {
              start: 18,
              end: 45,
              type: "hyperlink",
              data: {
                link_type: "Document",
                id: "XuE3SRIAACEAYWIF",
                type: "product",
                tags: [],
                lang: "en-gb",
                slug: "product-1",
                uid: "product-1",
                isBroken: false
              }
            }
          ]
        }
      ];

      expect(richTextToMarkdown(url)).toBe(
        "This is some text [with a link to google](https://google.com), followed by more text"
      );
      expect(richTextToMarkdown(imageUrl)).toBe(
        "This is some text [with a link to a media item](https://images.prismic.io/slicemachine-blank/6b2bf485-aa12-44ef-8f06-dce6b91b9309_dancing.png?auto=compress,format)"
      );
      expect(richTextToMarkdown(documentUrl, ({ lang, type, uid }) => `/${lang}/${type}/${uid}`)).toBe(
        "This is some text [with a link to a document](/en-gb/product/product-1)"
      );
    });
    it("converts paragraphs with urls and emphasis", () => {
      const url = [
        {
          text: "This is some text with a link to google, followed by more text",
          type: "paragraph",
          spans: [
            {
              start: 18,
              end: 39,
              type: "strong"
            },
            {
              start: 18,
              end: 39,
              type: "hyperlink",
              data: {
                link_type: "Web",
                url: "https://google.com"
              }
            }
          ]
        }
      ];
      const imageUrl = [
        {
          text: "This is some text with a link to a media item",
          type: "paragraph",
          spans: [
            {
              start: 18,
              end: 45,
              type: "strong"
            },
            {
              start: 18,
              end: 45,
              type: "hyperlink",
              data: {
                link_type: "Media",
                url: "https://images.prismic.io/slicemachine-blank/6b2bf485-aa12-44ef-8f06-dce6b91b9309_dancing.png?auto=compress,format"
              }
            }
          ]
        }
      ];
      const documentUrl = [
        {
          text: "This is some text with a link to a document",
          type: "paragraph",
          spans: [
            {
              start: 18,
              end: 43,
              type: "strong"
            },
            {
              start: 18,
              end: 43,
              type: "hyperlink",
              data: {
                link_type: "Document",
                id: "XuE3SRIAACEAYWIF",
                type: "product",
                tags: [],
                lang: "en-gb",
                slug: "product-1",
                uid: "product-1",
                isBroken: false
              }
            }
          ]
        }
      ];

      expect(richTextToMarkdown(url)).toBe(
        "This is some text **[with a link to google](https://google.com)**, followed by more text"
      );
      expect(richTextToMarkdown(imageUrl)).toBe(
        "This is some text **[with a link to a media item](https://images.prismic.io/slicemachine-blank/6b2bf485-aa12-44ef-8f06-dce6b91b9309_dancing.png?auto=compress,format)**"
      );
      expect(richTextToMarkdown(documentUrl, ({ lang, type, uid }) => `/${lang}/${type}/${uid}`)).toBe(
        "This is some text **[with a link to a document](/en-gb/product/product-1)**"
      );
    });
    it("converts preformtted text", () => {
      const preformtted = [
        {
          text: "// This is a code comment\n// another comment",
          type: "preformatted",
          spans: []
        }
      ];
      expect(richTextToMarkdown(preformtted)).toBe(
        "```\n// This is a code comment\n// another comment\n```"
      );
    });
    it("converts lists", () => {
      const orderedList = [
        {
          text: "Item 1",
          type: "o-list-item"
        },
        {
          text: "Item 2",
          type: "o-list-item"
        }
      ];
      const unorderedList = [
        {
          text: "Item 1",
          type: "list-item"
        },
        {
          text: "Item 2",
          type: "list-item"
        }
      ];
      const twoLists = [
        {
          text: "Item 1",
          type: "o-list-item"
        },
        {
          text: "Item 2",
          type: "o-list-item"
        },
        {
          text: "",
          type: "paragraph"
        },
        {
          text: "Item 1",
          type: "o-list-item"
        },
        {
          text: "Item 2",
          type: "o-list-item"
        }
      ];

      expect(richTextToMarkdown(orderedList)).toBe("1. Item 1\n\n1. Item 2");
      expect(richTextToMarkdown(unorderedList)).toBe("- Item 1\n\n- Item 2");
      expect(richTextToMarkdown(twoLists)).toBe(
        "1. Item 1\n\n1. Item 2\n\n&nbsp;\n\n1. Item 1\n\n1. Item 2"
      );
    });
    it("handles paragraphs", () => {
      const paragraphs = [
        {
          text: "This is a heading",
          type: "heading1",
          spans: []
        },
        {
          text:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit.\nInteger id cursus urna. Mauris non fermentum leo.",
          type: "paragraph",
          spans: []
        },
        {
          text:
            "Integer tristique, neque id tincidunt congue, massa diam congue libero, at blandit turpis neque a purus.",
          type: "paragraph",
          spans: []
        }
      ];

      expect(richTextToMarkdown(paragraphs)).toBe(
        "# This is a heading\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit.\nInteger id cursus urna. Mauris non fermentum leo.\n\nInteger tristique, neque id tincidunt congue, massa diam congue libero, at blandit turpis neque a purus."
      );
    });
    it("ignores document links if a link resolver isn't passed in", () => {
      const documentUrl = [
        {
          text: "This is some text with a link to a document",
          type: "paragraph",
          spans: [
            {
              start: 18,
              end: 45,
              type: "hyperlink",
              data: {
                link_type: "Document",
                id: "XuE3SRIAACEAYWIF",
                type: "product",
                tags: [],
                lang: "en-gb",
                slug: "product-1",
                uid: "product-1",
                isBroken: false
              }
            }
          ]
        }
      ];

      expect(richTextToMarkdown(documentUrl)).toBe("This is some text with a link to a document");
    });
    it("ignores links that it doesn't recognise", () => {
      const unknownLink = [
        {
          text: "This is a link",
          type: "paragraph",
          spans: [
            {
              start: 0,
              end: 14,
              type: "hyperlink",
              data: {
                link_type: "Video",
              }
            }
          ]
        }
      ];

      expect(richTextToMarkdown(unknownLink)).toBe("This is a link");
    })
    it("ignores spans that it doesn't recognise", () => {
      const unknownSpan = [
        {
          text: "This is a string",
          type: "paragraph",
          spans: [
            {
              start: 0,
              end: 16,
              type: "random"
            }
          ]
        }
      ];

      expect(richTextToMarkdown(unknownSpan)).toBe("This is a string");
    });
    it("ignores types that it doesn't recognise", () => {
      const unknownType = [
        {
          type: "embed",
          oembed: {}
        }
      ];

      expect(richTextToMarkdown(unknownType)).toBe("");
    });
  });
});
