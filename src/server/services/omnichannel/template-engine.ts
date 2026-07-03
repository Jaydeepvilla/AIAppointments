export const templateEngine = {
  /**
   * Replace double-curly variables in template body/subject
   * e.g. "Hello {{customer_name}}, confirmed for {{appointment_time}}"
   */
  render(content: string, variables: Record<string, string>): string {
    if (!content) return "";
    
    let rendered = content;
    
    // Iterate over all variables passed and replace occurrences
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, "gi");
      rendered = rendered.replace(regex, value || "");
    }
    
    // Strip out any unresolved variables to prevent raw placeholders showing
    rendered = rendered.replace(/\{\{\s*[\w_]+\s*\}\}/g, "");
    
    return rendered;
  },

  /**
   * Helper to build default replacement context variables from profiles and appointments
   */
  buildVariablesContext(data: {
    customerName?: string | null;
    appointmentTime?: string | null;
    serviceName?: string | null;
    staffName?: string | null;
    businessName?: string | null;
    cancelLink?: string | null;
    customFields?: Record<string, string>;
  }): Record<string, string> {
    const context: Record<string, string> = {
      customer_name: data.customerName || "there",
      appointment_time: data.appointmentTime || "your scheduled time",
      service_name: data.serviceName || "service",
      staff_name: data.staffName || "our team",
      business_name: data.businessName || "our business",
      cancel_link: data.cancelLink || "N/A"
    };

    if (data.customFields) {
      for (const [key, val] of Object.entries(data.customFields)) {
        context[key.toLowerCase()] = val;
      }
    }

    return context;
  }
};
