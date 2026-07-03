export interface CalendarBusyPeriod {
  start: Date;
  end: Date;
}

export interface ExternalEventInput {
  title: string;
  start: Date;
  end: Date;
  description?: string;
}

export interface CalendarProvider {
  getBusyPeriods(
    accessToken: string,
    refreshToken: string | null,
    expiresAt: Date | null,
    externalCalendarId: string | null,
    start: Date,
    end: Date
  ): Promise<CalendarBusyPeriod[]>;

  createEvent(
    accessToken: string,
    refreshToken: string | null,
    expiresAt: Date | null,
    externalCalendarId: string | null,
    event: ExternalEventInput
  ): Promise<{ externalId: string }>;

  updateEvent(
    accessToken: string,
    refreshToken: string | null,
    expiresAt: Date | null,
    externalCalendarId: string | null,
    externalId: string,
    event: ExternalEventInput
  ): Promise<void>;

  deleteEvent(
    accessToken: string,
    refreshToken: string | null,
    expiresAt: Date | null,
    externalCalendarId: string | null,
    externalId: string
  ): Promise<void>;
}

export class GoogleCalendarProvider implements CalendarProvider {
  async getBusyPeriods(
    accessToken: string,
    refreshToken: string | null,
    expiresAt: Date | null,
    externalCalendarId: string | null,
    start: Date,
    end: Date
  ): Promise<CalendarBusyPeriod[]> {
    console.log(`[GoogleCalendarProvider] Fetch availability for: ${externalCalendarId || "primary"}`);
    // Simulated busy blocks (stub)
    return [];
  }

  async createEvent(
    accessToken: string,
    refreshToken: string | null,
    expiresAt: Date | null,
    externalCalendarId: string | null,
    event: ExternalEventInput
  ): Promise<{ externalId: string }> {
    console.log(`[GoogleCalendarProvider] Create event: "${event.title}"`);
    return { externalId: `google_event_${Math.random().toString(36).substr(2, 9)}` };
  }

  async updateEvent(
    accessToken: string,
    refreshToken: string | null,
    expiresAt: Date | null,
    externalCalendarId: string | null,
    externalId: string,
    event: ExternalEventInput
  ): Promise<void> {
    console.log(`[GoogleCalendarProvider] Update event ${externalId}: "${event.title}"`);
  }

  async deleteEvent(
    accessToken: string,
    refreshToken: string | null,
    expiresAt: Date | null,
    externalCalendarId: string | null,
    externalId: string
  ): Promise<void> {
    console.log(`[GoogleCalendarProvider] Delete event ${externalId}`);
  }
}

export class OutlookCalendarProvider implements CalendarProvider {
  async getBusyPeriods(
    accessToken: string,
    refreshToken: string | null,
    expiresAt: Date | null,
    externalCalendarId: string | null,
    start: Date,
    end: Date
  ): Promise<CalendarBusyPeriod[]> {
    console.log(`[OutlookCalendarProvider] Fetch availability`);
    return [];
  }

  async createEvent(
    accessToken: string,
    refreshToken: string | null,
    expiresAt: Date | null,
    externalCalendarId: string | null,
    event: ExternalEventInput
  ): Promise<{ externalId: string }> {
    console.log(`[OutlookCalendarProvider] Create event: "${event.title}"`);
    return { externalId: `outlook_event_${Math.random().toString(36).substr(2, 9)}` };
  }

  async updateEvent(
    accessToken: string,
    refreshToken: string | null,
    expiresAt: Date | null,
    externalCalendarId: string | null,
    externalId: string,
    event: ExternalEventInput
  ): Promise<void> {
    console.log(`[OutlookCalendarProvider] Update event ${externalId}`);
  }

  async deleteEvent(
    accessToken: string,
    refreshToken: string | null,
    expiresAt: Date | null,
    externalCalendarId: string | null,
    externalId: string
  ): Promise<void> {
    console.log(`[OutlookCalendarProvider] Delete event ${externalId}`);
  }
}

export class CalendlyProvider implements CalendarProvider {
  async getBusyPeriods(
    accessToken: string,
    refreshToken: string | null,
    expiresAt: Date | null,
    externalCalendarId: string | null,
    start: Date,
    end: Date
  ): Promise<CalendarBusyPeriod[]> {
    console.log(`[CalendlyProvider] Fetch availability`);
    return [];
  }

  async createEvent(
    accessToken: string,
    refreshToken: string | null,
    expiresAt: Date | null,
    externalCalendarId: string | null,
    event: ExternalEventInput
  ): Promise<{ externalId: string }> {
    console.log(`[CalendlyProvider] Create event mapping`);
    return { externalId: `calendly_event_${Math.random().toString(36).substr(2, 9)}` };
  }

  async updateEvent(
    accessToken: string,
    refreshToken: string | null,
    expiresAt: Date | null,
    externalCalendarId: string | null,
    externalId: string,
    event: ExternalEventInput
  ): Promise<void> {
    console.log(`[CalendlyProvider] Update event`);
  }

  async deleteEvent(
    accessToken: string,
    refreshToken: string | null,
    expiresAt: Date | null,
    externalCalendarId: string | null,
    externalId: string
  ): Promise<void> {
    console.log(`[CalendlyProvider] Delete event`);
  }
}

export const providerRegistry = {
  getProvider(provider: string): CalendarProvider {
    switch (provider.toLowerCase()) {
      case "google":
        return new GoogleCalendarProvider();
      case "outlook":
      case "microsoft":
        return new OutlookCalendarProvider();
      case "calendly":
        return new CalendlyProvider();
      default:
        throw new Error(`Unsupported calendar provider: ${provider}`);
    }
  },
};
