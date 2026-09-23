import PropTypes from "prop-types";
import { useCurrency } from "../../context/CurrencyContext";

/**
 * Renders a EUR-priced amount in the user's selected currency.
 * All money in the app is stored in EUR; this is the single
 * place where conversion/formatting happens.
 *
 * @param {{ amount: number, className?: string, perNight?: boolean }} props
 */
function Price({ amount, className = "", perNight = false }) {
  const { formatPrice } = useCurrency();

  if (amount == null || Number.isNaN(Number(amount))) return null;

  return (
    <span className={className}>
      {formatPrice(Number(amount))}
      {perNight && (
        <span className="ml-1 text-xs font-normal text-slate-400">
          / night
        </span>
      )}
    </span>
  );
}

Price.propTypes = {
  amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  className: PropTypes.string,
  perNight: PropTypes.bool,
};

export default Price;
