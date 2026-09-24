import { HiGlobeAlt } from "react-icons/hi";
import { useCurrency } from "../../context/CurrencyContext";

/**
 * Currency switcher (EUR base -> USD/GBP/JPY/... via live rates).
 * Drives the `useCurrency` provider consumed by <Price /> everywhere.
 */
function CurrencySwitcher() {
  const { currency, setCurrency, currencies, ratesStatus } = useCurrency();

  return (
    <label
      className="relative flex cursor-pointer items-center"
      title={
        ratesStatus === "failed"
          ? "Exchange rates unavailable — showing EUR"
          : "Display prices in"
      }
    >
      <HiGlobeAlt className="pointer-events-none absolute left-2 h-4 w-4 text-slate-400" />
      <select
        aria-label="Display currency"
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="cursor-pointer appearance-none rounded-xl border border-transparent bg-transparent py-2 pl-7 pr-6 text-sm font-semibold text-slate-600 transition hover:border-slate-200 hover:bg-slate-50 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-900"
      >
        {currencies.map((code) => (
          <option key={code} value={code}>
            {code}
          </option>
        ))}
      </select>
    </label>
  );
}

export default CurrencySwitcher;
