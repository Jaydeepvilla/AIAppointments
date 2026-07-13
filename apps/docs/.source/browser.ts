// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  docs: create.doc("docs", {"index.mdx": () => import("../content/docs/index.mdx?collection=docs"), "appointments/services-menu.mdx": () => import("../content/docs/appointments/services-menu.mdx?collection=docs"), "appointments/view-appointments.mdx": () => import("../content/docs/appointments/view-appointments.mdx?collection=docs"), "channels/connect-email.mdx": () => import("../content/docs/channels/connect-email.mdx?collection=docs"), "channels/connect-instagram.mdx": () => import("../content/docs/channels/connect-instagram.mdx?collection=docs"), "channels/connect-sms.mdx": () => import("../content/docs/channels/connect-sms.mdx?collection=docs"), "channels/connect-whatsapp.mdx": () => import("../content/docs/channels/connect-whatsapp.mdx?collection=docs"), "developer/index.mdx": () => import("../content/docs/developer/index.mdx?collection=docs"), "getting-started/account-setup.mdx": () => import("../content/docs/getting-started/account-setup.mdx?collection=docs"), "getting-started/business-profile.mdx": () => import("../content/docs/getting-started/business-profile.mdx?collection=docs"), "inbox/manage-leads.mdx": () => import("../content/docs/inbox/manage-leads.mdx?collection=docs"), "inbox/view-messages.mdx": () => import("../content/docs/inbox/view-messages.mdx?collection=docs"), "knowledge-base/add-documents.mdx": () => import("../content/docs/knowledge-base/add-documents.mdx?collection=docs"), "public/index.mdx": () => import("../content/docs/public/index.mdx?collection=docs"), }),
};
export default browserCollections;