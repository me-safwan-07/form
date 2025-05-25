import { revalidateTag } from "next/cache";

interface RevalidateProps {
  id?: string;
  userId?: string;
  environmentId?: string;
}

export const productCache = {
  tag: {
    byId(id: string) {
      return `product-${id}`;
    },
    byUserId(userId: string) {
      return `users-${userId}-products`;
    },
    byEnvironmentId(environmentId: string) {
      return `environments-${environmentId}-products`;
    },
  },
  revalidate({ id, userId, environmentId }: RevalidateProps): void {
    if (id) {
      revalidateTag(this.tag.byId(id));
    }

    if (environmentId) {
      revalidateTag(this.tag.byEnvironmentId(environmentId));
    }

    if (userId) {
      revalidateTag(this.tag.byUserId(userId));
    }
  },
};
