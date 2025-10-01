import React from "react";

type Props = {
  onClick: () => void;
  disabled?: boolean;
};

const OrderUpdateButton = ({ onClick, disabled }: Props) => (
  <button type="button" onClick={onClick} disabled={disabled}>
    更新
  </button>
);

export default OrderUpdateButton;