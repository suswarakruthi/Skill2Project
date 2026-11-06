import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Login from "../src/pages/Login";
import { supabase } from "../src/lib/supabaseClient";

vi.mock("../src/lib/supabaseClient", () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
    },
  },
}));

describe("Skill2Pro Login Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderLogin = () =>
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<h1>Dashboard test page</h1>} />
        </Routes>
      </MemoryRouter>
    );

  it("renders the login page correctly", () => {
    renderLogin();
    expect(screen.getByRole("heading", { name: /welcome back/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("shows an error when email and password are empty", async () => {
    renderLogin();

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "" },
    });

    const form = screen.getByLabelText(/email address/i).closest("form");
    fireEvent.submit(form);

    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).not.toHaveBeenCalled();
    });
  });

  it("navigates to dashboard after successful login", async () => {
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: { id: "test-user" } },
      error: null,
    });

    renderLogin();

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.submit(screen.getByLabelText(/email address/i).closest("form"));

    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });

    expect(await screen.findByText("Dashboard test page")).toBeInTheDocument();
  });
});
