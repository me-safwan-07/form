import { revalidateTag } from "next/cache";

interface RevalidateProps {
  id?: string;
  formId?: string;
  personId?: string | null;
  environmentId?: string;
}

export const displayCache = {
  tag: {
    byId(id: string) {
      return `displays-${id}`;
    },
    byFormId(formId: string) {
      return `surveys-${formId}-displays`;
    },
    byPersonId(personId: string) {
      return `people-${personId}-displays`;
    },
    byEnvironmentId(environmentId: string) {
      return `environments-${environmentId}-displays`;
    },
  },
  revalidate({ id, formId, personId, environmentId }: RevalidateProps): void {
    if (id) {
      revalidateTag(this.tag.byId(id));
    }

    if (formId) {
      revalidateTag(this.tag.byFormId(formId));
    }

    if (personId) {
      revalidateTag(this.tag.byPersonId(personId));
    }

    if (environmentId) {
      revalidateTag(this.tag.byEnvironmentId(environmentId));
    }
  },
};
