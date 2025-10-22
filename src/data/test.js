// DOCUMENTATION FOR BACKEND API
// The API endpoint for navigation should return an array of objects matching this structure.

const navigationDataStructure = [
  // =================================================================
  // LEVEL 0: Main Category (The top-level link in the navbar)
  // =================================================================
  {
    "label": "Sofa",        // The text displayed in the navbar.
    "path": "/products/sofa", // The main link for the entire category.

    // The `megaMenu` key is OPTIONAL. If a category does not have a dropdown,
    // this key should be omitted entirely (like the "Home" item below).
    "megaMenu": [

      // =================================================================
      // LEVEL 1: Sub-Category (A single column in the dropdown menu)
      // =================================================================
      {
        "title": "Sofa Sets", // The title of the column.
        "items": [

          // =================================================================
          // LEVEL 2: Sub-Sub-Category (A group of links under a heading)
          // =================================================================
          {
            "subTitle": "By Size", // The heading for this group of links.
            "links": [

              // =================================================================
              // LEVEL 3: The final, clickable link
              // =================================================================
              { "label": "3 Seater Sofa", "path": "/products/3-seater" },
              { "label": "2 Seater Sofa", "path": "/products/2-seater" },
            ]
          }
        ]
      },
      // --- Another Level 1 Sub-Category column ---
      {
        "title": "Sectional Sofas",
        "items": [ /* ... */ ]
      }
    ]
  },
  
  // =================================================================
  // LEVEL 0: Main Category without a dropdown menu
  // =================================================================
  {
    "label": "Home",
    "path": "/"
    // Note: No `megaMenu` key. This will render as a simple link.
  }
];