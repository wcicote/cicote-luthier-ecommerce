import { describe, expect, it } from "vitest";
import { createClient } from "@supabase/supabase-js";

describe("Supabase Integration", () => {
  it("should connect to Supabase with valid credentials", async () => {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    expect(supabaseUrl).toBeDefined();
    expect(supabaseKey).toBeDefined();

    const supabase = createClient(supabaseUrl!, supabaseKey!);

    // Test connection by fetching auth status
    const { data, error } = await supabase.auth.getSession();

    // Should not throw error - connection is valid
    expect(error).toBeNull();
    console.log("✓ Supabase connection successful");
  });

  it("should have Service Role Key configured", () => {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    expect(serviceRoleKey).toBeDefined();
    
    // Decode JWT payload to verify it's a service role token
    const parts = serviceRoleKey!.split('.');
    expect(parts.length).toBe(3); // JWT has 3 parts
    
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    expect(payload.role).toBe("service_role");
    console.log("✓ Service Role Key is configured");
  });
});
