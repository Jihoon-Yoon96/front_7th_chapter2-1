import CartModal from "../components/cart/CartModal.js";
import { cartStore } from "../Store/cart.js";

/**
 * 장바구니 모달을 렌더링합니다.
 */
export function renderCartModal() {
  const modalContainer = document.getElementById("modal-container");
  if (!modalContainer) {
    console.error("Modal container not found.");
    return;
  }

  modalContainer.innerHTML = CartModal();
}

// cartStore 구독: 장바구니 상태 변경 시 모달 내용을 다시 렌더링
cartStore.subscribe(renderCartModal);
