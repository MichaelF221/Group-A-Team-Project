import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import { CreateAccount } from "../CreateAccount";

const renderCreateAccount = () => { 
  render(
    <MemoryRouter>
      <CreateAccount />
    </MemoryRouter>
  );
};

const fillForm = ({ 
  fullName = "Test User",
  email = "test@test.com",
  password = "pass123",
  confirmPassword = "pass123",
} = {}) => {
  fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: fullName } });
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: email } });
  fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: password } });
  fireEvent.change(screen.getByLabelText(/confirm/i), { target: { value: confirmPassword } });
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.unstubAllGlobals();
  vi.stubGlobal("fetch", vi.fn());
  vi.stubGlobal("localStorage", {
    setItem: vi.fn(),
    getItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  });
});


test("shows error when passwords don't match", () => {
  renderCreateAccount();

  fillForm({ password: "pass1", confirmPassword: "pass2" });

  fireEvent.click(screen.getByRole("button", { name: /create account/i }));

  expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
  expect(fetch).not.toHaveBeenCalled(); 
});

test("sends create account request with expected payload", async () => {
  fetch.mockResolvedValue({
    ok: true,
    json: async () => ({
      token: "token-123",
      user: { id: "u1", fullName: "Test User", email: "test@test.com" },
    }),
  });

  renderCreateAccount();
  fillForm();
  fireEvent.click(screen.getByRole("button", { name: /create account/i }));

  await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1)); 
  expect(fetch).toHaveBeenCalledWith("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName: "Test User",
      email: "test@test.com",
      password: "pass123",
    }),
  });
});

test("shows error message if similar account details have already previously been made", async () => {
  fetch.mockResolvedValue({
    ok: false,
    json: async () => ({ message: "An account with this email already exists." }),
  });

  renderCreateAccount();
  fillForm();
  fireEvent.click(screen.getByRole("button", { name: /create account/i }));

  expect(
    await screen.findByText(/an account with this email already exists/i)
  ).toBeInTheDocument();
});

test("shows server connection error when fetch throws", async () => {
  fetch.mockRejectedValue(new Error("Network error"));

  renderCreateAccount();
  fillForm();
  fireEvent.click(screen.getByRole("button", { name: /create account/i }));

  expect(await screen.findByText(/server connection failed/i)).toBeInTheDocument(); 
});