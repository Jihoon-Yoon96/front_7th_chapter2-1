import CartItem from "./CartItem.js";

export default function CartList(items) {
  return `
    <div class="flex-1 overflow-y-auto">
      <div class="p-4 space-y-4">
        ${items.map((item) => CartItem(item)).join("")}
      </div>
    </div>
  `;
}
