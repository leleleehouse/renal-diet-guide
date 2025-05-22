
import { create } from "zustand";

type Comorbidities = {
  diabetes: boolean;
  hypertension: boolean;
};

type PatientInfo = {
  age: string;
  gender: string;
  height: string;
  weight: string;
  dialysisType: string;
  urineOutput: string;
  comorbidities: Comorbidities;
};

type Store = {
  info: PatientInfo;
  setInfo: (newInfo: Partial<PatientInfo>) => void;
  reset: () => void;
};

export const usePatientStore = create<Store>((set) => ({
  info: {
    age: "",
    gender: "F",
    height: "",
    weight: "",
    dialysisType: "HD",
    urineOutput: "none",
    comorbidities: {
      diabetes: false,
      hypertension: false,
    },
  },
  setInfo: (newInfo) =>
    set((state) => ({
      info: {
        ...state.info,
        ...newInfo,
        comorbidities: {
          ...state.info.comorbidities,
          ...(newInfo.comorbidities || {}),
        },
      },
    })),
  reset: () =>
    set(() => ({
      info: {
        age: "",
        gender: "F",
        height: "",
        weight: "",
        dialysisType: "HD",
        urineOutput: "none",
        comorbidities: {
          diabetes: false,
          hypertension: false,
        },
      },
    })),
}));
