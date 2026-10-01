/** @format */
import { STATUS_LABEL, STATUS_STYLE, type OrderStatus } from "./orderUi";

const OrderStatusBadge = ({ status }: { status: OrderStatus }) => (
  <span
    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLE[status]}`}>
    {STATUS_LABEL[status]}
  </span>
);

export default OrderStatusBadge;
