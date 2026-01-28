import { useEffect, useMemo, useState } from "react";
import { publicAPI } from "@/utils/api";

const CACHE_TTL_MS = 60 * 60 * 1000;

const EU_COUNTRIES = new Set([
  "AT","BE","CY","EE","FI","FR","DE","GR","IE","IT","LV","LT","LU","MT","NL","PT","SK","SI","ES",
]);

const getLocaleRegion = () => {
  const locale =
    Intl.NumberFormat().resolvedOptions().locale ||
    Intl.DateTimeFormat().resolvedOptions().locale ||
    "en-US";
  const parts = locale.split("-");
  return parts[1] || "";
};

const getPreferredCurrency = () => {
  const region = getLocaleRegion().toUpperCase();
  if (region === "IN") return "INR";
  if (region === "US") return "USD";
  if (EU_COUNTRIES.has(region)) return "EUR";
  return "USD";
};

const getCachedRate = (currency) => {
  try {
    const key = `currency_rate_INR_${currency}`;
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.timestamp > CACHE_TTL_MS) return null;
    return parsed.rate;
  } catch {
    return null;
  }
};

const setCachedRate = (currency, rate) => {
  try {
    const key = `currency_rate_INR_${currency}`;
    localStorage.setItem(
      key,
      JSON.stringify({ rate, timestamp: Date.now() })
    );
  } catch {
    // ignore
  }
};

export const useCurrency = () => {
  const [currency, setCurrency] = useState(getPreferredCurrency());
  const [rate, setRate] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currency === "INR") {
      setRate(1);
      return;
    }

    const cached = getCachedRate(currency);
    if (cached) {
      setRate(cached);
      return;
    }

    const fetchRate = async () => {
      setLoading(true);
      try {
        const res = await publicAPI.getRates("INR", currency);
        const nextRate = Number(res.data?.rates?.[currency]);
        if (Number.isFinite(nextRate)) {
          setRate(nextRate);
          setCachedRate(currency, nextRate);
        } else {
          setRate(1);
        }
      } catch {
        setRate(1);
      } finally {
        setLoading(false);
      }
    };

    fetchRate();
  }, [currency]);

  const formatter = useMemo(() => {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    });
  }, [currency]);

  const convert = (amountInInr) => {
    const amount = Number(amountInInr || 0);
    return Number((amount * rate).toFixed(2));
  };

  const format = (amountInInr) => formatter.format(convert(amountInInr));

  return { currency, rate, loading, convert, format, setCurrency };
};
