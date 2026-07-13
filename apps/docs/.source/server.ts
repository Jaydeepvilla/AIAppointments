// @ts-nocheck
import { default as __fd_glob_18 } from "../content/docs/knowledge-base/meta.json?collection=meta"
import { default as __fd_glob_17 } from "../content/docs/inbox/meta.json?collection=meta"
import { default as __fd_glob_16 } from "../content/docs/getting-started/meta.json?collection=meta"
import { default as __fd_glob_15 } from "../content/docs/channels/meta.json?collection=meta"
import { default as __fd_glob_14 } from "../content/docs/appointments/meta.json?collection=meta"
import * as __fd_glob_13 from "../content/docs/public/index.mdx?collection=docs"
import * as __fd_glob_12 from "../content/docs/knowledge-base/add-documents.mdx?collection=docs"
import * as __fd_glob_11 from "../content/docs/inbox/view-messages.mdx?collection=docs"
import * as __fd_glob_10 from "../content/docs/inbox/manage-leads.mdx?collection=docs"
import * as __fd_glob_9 from "../content/docs/getting-started/business-profile.mdx?collection=docs"
import * as __fd_glob_8 from "../content/docs/getting-started/account-setup.mdx?collection=docs"
import * as __fd_glob_7 from "../content/docs/developer/index.mdx?collection=docs"
import * as __fd_glob_6 from "../content/docs/channels/connect-whatsapp.mdx?collection=docs"
import * as __fd_glob_5 from "../content/docs/channels/connect-sms.mdx?collection=docs"
import * as __fd_glob_4 from "../content/docs/channels/connect-instagram.mdx?collection=docs"
import * as __fd_glob_3 from "../content/docs/channels/connect-email.mdx?collection=docs"
import * as __fd_glob_2 from "../content/docs/appointments/view-appointments.mdx?collection=docs"
import * as __fd_glob_1 from "../content/docs/appointments/services-menu.mdx?collection=docs"
import * as __fd_glob_0 from "../content/docs/index.mdx?collection=docs"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const docs = await create.doc("docs", "content/docs", {"index.mdx": __fd_glob_0, "appointments/services-menu.mdx": __fd_glob_1, "appointments/view-appointments.mdx": __fd_glob_2, "channels/connect-email.mdx": __fd_glob_3, "channels/connect-instagram.mdx": __fd_glob_4, "channels/connect-sms.mdx": __fd_glob_5, "channels/connect-whatsapp.mdx": __fd_glob_6, "developer/index.mdx": __fd_glob_7, "getting-started/account-setup.mdx": __fd_glob_8, "getting-started/business-profile.mdx": __fd_glob_9, "inbox/manage-leads.mdx": __fd_glob_10, "inbox/view-messages.mdx": __fd_glob_11, "knowledge-base/add-documents.mdx": __fd_glob_12, "public/index.mdx": __fd_glob_13, });

export const meta = await create.meta("meta", "content/docs", {"appointments/meta.json": __fd_glob_14, "channels/meta.json": __fd_glob_15, "getting-started/meta.json": __fd_glob_16, "inbox/meta.json": __fd_glob_17, "knowledge-base/meta.json": __fd_glob_18, });