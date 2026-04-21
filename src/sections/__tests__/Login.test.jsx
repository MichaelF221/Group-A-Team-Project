import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import { Login } from "../Login";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderLogin = () => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
};

const fillForm = ({ email = "test@example.com", password = "securepass" } = {}) => {
  fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: email } });
  fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: password } });
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

test("shows error message when email or password isnt recognised from the stored accounts already made", async () => {
  fetch.mockResolvedValue({
    ok: false,
    headers: { get: vi.fn().mockReturnValue("application/json") },
    json: vi.fn().mockResolvedValue({ message: "Invalid email or password." }),
  });

  renderLogin();
  fillForm();
  fireEvent.click(screen.getByRole("button", { name: /log in/i })); 

  expect(await screen.findByText("Invalid email or password.")).toBeInTheDocument(); 
  expect(mockNavigate).not.toHaveBeenCalled(); 
});

test("shows fallback message when login fails", async () => {
  fetch.mockResolvedValue({
    ok: false,
    headers: { get: vi.fn().mockReturnValue("text/html") }, 
    json: vi.fn(),
  });

  renderLogin();
  fillForm();
  fireEvent.click(screen.getByRole("button", { name: /log in/i }));

  expect(await screen.findByText("Login failed.")).toBeInTheDocument(); 
  expect(mockNavigate).not.toHaveBeenCalled();
});

test("shows network error when request throws", async () => {
  fetch.mockRejectedValue(new Error("Network down"));

  renderLogin();
  fillForm();
  fireEvent.click(screen.getByRole("button", { name: /log in/i }));

  expect(await screen.findByText("Server connection failed.")).toBeInTheDocument(); 
  expect(mockNavigate).not.toHaveBeenCalled();
});