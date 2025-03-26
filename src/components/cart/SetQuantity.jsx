const btnStyles = "border-[1.2px] border-slate-800 px-3 py-1 rounded";
const SetQuantity = ({
  quantity,
  cardCounter,
  handeQtyIncrease,
  handleQtyDecrease,
  productId,
}) => {
  return (
    <div className="flex gap-8 items-center" data-testid={`quantity-selector-${productId || 'default'}`}>
      {cardCounter ? null : <div className="font-semibold">QUANTITY</div>}
      <div className="flex md:flex-row flex-col gap-4 items-center lg:text-[22px] text-sm">
        <button
          disabled={quantity <= 1}
          className={btnStyles}
          onClick={handleQtyDecrease}
          data-testid={`decrease-button-${productId || 'default'}`}>
          -
        </button>
        <div className="text-red-500" data-testid={`quantity-value-${productId || 'default'}`}>{quantity}</div>
        <button
          className={btnStyles}
          onClick={handeQtyIncrease}
          data-testid={`increase-button-${productId || 'default'}`}>
          +
        </button>
      </div>
    </div>
  );
};

export default SetQuantity;