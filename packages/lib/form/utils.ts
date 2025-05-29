import { TFormFilterCriteria } from "@/packages/types/forms";
import { Prisma } from "@prisma/client";

export const buildWhereClause = (filterCriteria?: TFormFilterCriteria) => {
  const whereClause: Prisma.FormWhereInput["AND"] = [];

  // for name
  if (filterCriteria?.name) {
    whereClause.push({ name: { contains: filterCriteria.name, mode: "insensitive" } });
  }

  // for status
  if (filterCriteria?.status && filterCriteria?.status?.length) {
    whereClause.push({ status: { in: filterCriteria.status } });
  }

  return { AND: whereClause };
};

export const buildOrderByClause = (
  sortBy?: TFormFilterCriteria["sortBy"]
): Prisma.FormOrderByWithRelationInput[] | undefined => {
  if (!sortBy) {
    return undefined;
  }

  if (sortBy === "name") {
    return [{ name: "asc" }];
  }

  return [{ [sortBy]: "desc" }];
};