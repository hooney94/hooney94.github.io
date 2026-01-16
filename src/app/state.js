import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const STORAGE_KEY = "QUOTE_WIZARD_STATE_V1";

const initialState = {
  customer: {
    name: "",
    phone: "",
    phoneVerified: false,
    zip: "",
    addr1: "",
    addr2: "",
  },
  conditions: {
    openingStatus: "unknown", // yes | no | unknown
    py: "",
    wiringProvider: "agency", // gbis | hanssem | agency
  },
  lighting: {
    selectedBrandId: "hanssem",
    selectedCategoryId: "",
    search: "",
    cart: [] // [{productId, qty}]
  },
  switch: {
    gang: 1, // 1~6
    custom: false,
    customName: "",
    customUnitPrice: "",
  },
  admin: {
    // 비용항목(코드 기반) - 나중에 계산식에서 참조
    costConfig: {
      OPENING_FEE: 0,
      OPENING_UNIT_PER_PY: 0,
      INSTALL_UNIT_PER_PY: 0,
      SWITCH_UNIT_PER_GANG: 0,
      MAINLIGHT_INSTALL_UNIT: 0,
      DOWNLIGHT_INSTALL_UNIT: 0,
      LINE_INSTALL_UNIT: 0,
    },
    // 제품/카테고리 관리자 기능은 일단 export/import 로컬저장으로 제공
  }
};

function reducer(state, action) {
  switch (action.type) {
    case "LOAD":
      return action.payload ?? state;
    case "SET_CUSTOMER":
      return { ...state, customer: { ...state.customer, ...action.payload } };
    case "SET_CONDITIONS":
      return { ...state, conditions: { ...state.conditions, ...action.payload } };
    case "SET_LIGHTING":
      return { ...state, lighting: { ...state.lighting, ...action.payload } };
    case "ADD_TO_CART": {
      const { productId, qty } = action.payload;
      const cart = [...state.lighting.cart];
      const idx = cart.findIndex((x) => x.productId === productId);
      if (idx >= 0) cart[idx] = { ...cart[idx], qty: cart[idx].qty + qty };
      else cart.push({ productId, qty });
      return { ...state, lighting: { ...state.lighting, cart } };
    }
    case "SET_CART_QTY": {
      const { productId, qty } = action.payload;
      const cart = state.lighting.cart
        .map((x) => (x.productId === productId ? { ...x, qty } : x))
        .filter((x) => x.qty > 0);
      return { ...state, lighting: { ...state.lighting, cart } };
    }
    case "SET_SWITCH":
      return { ...state, switch: { ...state.switch, ...action.payload } };
    case "SET_COST_CONFIG":
      return { ...state, admin: { ...state.admin, costConfig: { ...state.admin.costConfig, ...action.payload } } };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

const WizardContext = createContext(null);

export function WizardProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        dispatch({ type: "LOAD", payload: JSON.parse(raw) });
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <WizardContext.Provider value={value}>{children}</WizardContext.Provider>;
}

export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("WizardProvider missing");
  return ctx;
}
