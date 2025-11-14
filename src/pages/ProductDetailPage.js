import productStore from "../Store/product.js";
import { cartStore } from "../Store/cart.js";
import { toastStore } from "../Store/toast.js";
import { router } from "../Router/router.js";
import DetailBreadcrumb from "../components/product/detail/Breadcrumb.js";
import ProductInfo from "../components/product/detail/ProductInfo.js";
import RelatedProducts from "../components/product/detail/RelatedProducts.js";

let eventsInitialized = false;
let quantity = 1;

/**
 * 상품 상세 정보 렌더링
 * @param {object} productData - 상품 상세 정보 객체
 */
function renderProductDetail(productData) {
  const detail = productData;
  // TODO: 관련 상품 API 구현 후 수정 필요
  const relatedProducts = [];
  quantity = 1; // 상세 페이지 진입 시 수량을 1로 초기화

  return `
    ${DetailBreadcrumb(detail)}
    ${ProductInfo(detail, quantity)}
    ${RelatedProducts(relatedProducts)}
  `;
}

function render() {
  const pageContainer = document.getElementById("product-detail-page");
  if (!pageContainer) return;

  const { loading, data, error } = productStore.getState().productDetail;

  if (loading) {
    pageContainer.innerHTML = `
      <div class="py-20 bg-gray-50 flex items-center justify-center">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-600">상품 정보를 불러오는 중...</p>
        </div>
      </div>
    `;
  } else if (error) {
    pageContainer.innerHTML = `
      <div class="text-center py-10">
        <p class="text-red-500 font-bold">데이터를 불러오는데 실패했습니다.</p>
        <p class="text-gray-500 text-sm mb-4">${error}</p>
        <button id="retry-fetch" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded">재시도</button>
      </div>
    `;
  } else if (data) {
    pageContainer.innerHTML = renderProductDetail(data);
  }
}

function setupEventListeners(productId) {
  if (eventsInitialized) return;

  document.body.addEventListener("click", (e) => {
    const pageContainer = e.target.closest("#product-detail-page");
    if (!pageContainer) return;

    // 재시도 버튼
    if (e.target.id === "retry-fetch") {
      productStore.fetchProductById(productId);
      return;
    }

    // 수량 조절
    const quantityInput = document.getElementById("quantity-input");
    if (!quantityInput) return;

    const stock = parseInt(quantityInput.max, 10);

    if (e.target.closest("#quantity-increase")) {
      if (quantity < stock) {
        quantity++;
        quantityInput.value = quantity;
      }
    } else if (e.target.closest("#quantity-decrease")) {
      if (quantity > 1) {
        quantity--;
        quantityInput.value = quantity;
      }
    }

    // 장바구니 담기
    const addToCartBtn = e.target.closest("#add-to-cart-btn");
    if (addToCartBtn) {
      const { productId: btnProductId } = addToCartBtn.dataset;
      const { data } = productStore.getState().productDetail;
      if (data && data.productId === btnProductId) {
        cartStore.addItem(data, quantity);
        toastStore.showToast("장바구니에 상품이 추가되었습니다.", "success");
      }
      return;
    }

    // 관련 상품 클릭
    const relatedCard = e.target.closest(".related-product-card");
    if (relatedCard) {
      const { productId: relatedProductId } = relatedCard.dataset;
      router.navigate(`/product/${relatedProductId}`);
      return;
    }

    // 목록으로 돌아가기
    if (e.target.closest(".go-to-product-list")) {
      window.history.back();
      return;
    }

    // 브레드크럼 클릭
    const breadcrumb = e.target.closest(".breadcrumb-link");
    if (breadcrumb) {
      const { category1, category2 } = breadcrumb.dataset;
      router.navigate(`/?category1=${category1 || ""}&category2=${category2 || ""}`);
      return;
    }
  });

  eventsInitialized = true;
}

export function ProductDetailPage({ params }) {
  const onMount = () => {
    console.log("ProductDetailPage onMount, params:", params);
    setupEventListeners(params.id);
    const unsubscribe = productStore.subscribe(render);
    productStore.fetchProductById(params.id);

    return () => {
      unsubscribe();
      // eventsInitialized = false; // 페이지 전환 시 이벤트 리스너를 유지하므로 주석 처리
    };
  };

  return {
    html: `<main id="product-detail-page" class="max-w-md mx-auto px-4 py-4"></main>`,
    onMount,
  };
}
