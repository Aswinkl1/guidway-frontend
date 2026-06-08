import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import {
  addAvailability,
  deleteAvailability,
  getAvailability,
  toggleAvailability,
} from "../services/availability.services";
import toast from "react-hot-toast";

export const useAvailability = () => {
  return useQuery({
    queryKey: ["availability"],
    queryFn: getAvailability,
    placeholderData: keepPreviousData,
    select: (data) => {
      const availabilityMap = new Map(
        data.map((item: any) => [item.dayOfWeek, item]),
      );

      const result = defaultAvailability.map((day) => ({
        ...day,
        ...(availabilityMap.get(day.dayOfWeek) || {}),
      }));
      return result;
    },
  });
};

export const useAddAvailability = () => {
  return useMutation({
    mutationFn: addAvailability,
    onSuccess: () => {
      toast.success("slot add successfull");
    },
  });
};

export const useDeleteAvailability = () => {
  return useMutation({
    mutationFn: deleteAvailability,
    onSuccess: () => {
      toast.success("slot deleted successfull");
    },
  });
};

export const useToggleAvailability = () => {
  return useMutation({
    mutationFn: toggleAvailability,
    onSuccess: () => {
      toast.success("slot toggle  successfull");
    },
  });
};

const defaultAvailability = [
  {
    dayOfWeek: "MONDAY",
    isActive: true,
    slots: [],
  },
  {
    dayOfWeek: "TUESDAY",
    isActive: true,
    slots: [],
  },
  {
    dayOfWeek: "WEDNESDAY",
    isActive: true,
    slots: [],
  },
  {
    dayOfWeek: "THURSDAY",
    isActive: true,
    slots: [],
  },
  {
    dayOfWeek: "FRIDAY",
    isActive: true,
    slots: [],
  },
  {
    dayOfWeek: "SATURDAY",
    isActive: true,
    slots: [],
  },
  {
    dayOfWeek: "SUNDAY",
    isActive: true,
    slots: [],
  },
];
