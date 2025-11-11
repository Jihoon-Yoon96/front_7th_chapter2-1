export default function CategoryButtons({ categories = {}, category1, category2 }) {
  let categoryButtonsHTML = "";
  let currentCategories = {};

  if (Object.keys(categories).length === 0) {
    return '<div class="text-sm text-gray-500 italic">카테고리 로딩 중...</div>';
  }

  if (!category1) {
    // 1-depth (category1) 보여주기
    currentCategories = categories;
    categoryButtonsHTML = Object.keys(currentCategories)
      .map((cat1) => {
        return `<button data-category1="${cat1}" class="category1-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors
                   bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
                  ${cat1}
                </button>`;
      })
      .join("");
  } else if (categories[category1] && !category2) {
    // 2-depth (category2) 보여주기
    currentCategories = categories[category1];
    categoryButtonsHTML = Object.keys(currentCategories)
      .map((cat2) => {
        return `<button data-category1="${category1}" data-category2="${cat2}" class="category2-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors 
                   bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
                  ${cat2}
                </button>`;
      })
      .join("");
  } else if (categories[category1] && category2) {
    // 2-depth (category2) 보여주기 (선택된 상태)
    currentCategories = categories[category1];
    categoryButtonsHTML = Object.keys(currentCategories)
      .map((cat2) => {
        const isSelected = cat2 === category2;
        const selectedClass = isSelected
          ? "bg-blue-100 border-blue-300 text-blue-800"
          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50";
        return `<button data-category1="${category1}" data-category2="${cat2}" class="category2-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors ${selectedClass}">
                  ${cat2}
                </button>`;
      })
      .join("");
  }

  return `
    <div class="flex flex-wrap gap-2" id="product-category">
      ${categoryButtonsHTML}
    </div>
  `;
}
