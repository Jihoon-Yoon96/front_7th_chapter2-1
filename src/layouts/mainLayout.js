import header from "../components/common/header.js";
import footer from "../components/common/footer.js";
import CartModal from "../components/cart/CartModal.js";

export default function mainLayout(children) {
  return `
    <div class="bg-gray-50">
      ${header({ cartNum: 4 })}
      ${children()}
      ${footer()}
      ${CartModal()}
    </div>
  `;
}
