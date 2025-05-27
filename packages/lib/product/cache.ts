import { revalidateTag } from "next/cache";

interface RevalidateProps {
  id?: string;
  userId?: string;
  environmentId?: string;
  organizationId?: string;
}

export const productCache = {
  tag: {
    byId(id: string) {
      return `product-${id}`;
    },
    byUserId(userId: string) {
      return `users-${userId}-products`;
    },
    byOrganizationId(organizationId: string) {
      return `organizations-${organizationId}-products`;
    },
    byEnvironmentId(environmentId: string) {
      return `environments-${environmentId}-products`;
    },
  },
  revalidate({ id, userId, environmentId, organizationId }: RevalidateProps): void {
    if (id) {
      revalidateTag(this.tag.byId(id));
    }

    if (organizationId) {
      revalidateTag(this.tag.byOrganizationId(organizationId));
    }


    if (environmentId) {
      revalidateTag(this.tag.byEnvironmentId(environmentId));
    }

    if (userId) {
      revalidateTag(this.tag.byUserId(userId));
    }
  },
};
