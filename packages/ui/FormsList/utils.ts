import { TFormFilterCriteria, TFormFilters } from "@/packages/types/forms";

export const getFormattedFilters = (formFilters: TFormFilters): TFormFilterCriteria => {
  const filters: TFormFilterCriteria = {};

  if (formFilters.name) {
    filters.name = formFilters.name;
  }

  if (formFilters.status && formFilters.status.length) {
    filters.status = formFilters.status;
  }

  if (formFilters.sortBy) {
    filters.sortBy = formFilters.sortBy;
  }

  return filters;
};
