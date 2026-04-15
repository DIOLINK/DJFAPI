import { render, screen, fireEvent } from "@testing-library/react";
import ThemeToggle from "../ThemeToggle";
import { useThemeStore } from "../../stores/useThemeStore";

jest.mock("../../stores/useThemeStore");

describe("ThemeToggle", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza y muestra el ícono de tema actual", () => {
    (useThemeStore as jest.Mock).mockReturnValue({ theme: "light", toggleTheme: jest.fn() });
    render(<ThemeToggle />);
    expect(screen.getByRole("button", { name: /cambiar claro/i })).toBeInTheDocument();
    expect(screen.getByText("☀️")).toBeInTheDocument();
  });

  it("llama a toggleTheme() al hacer click", () => {
    const toggle = jest.fn();
    (useThemeStore as jest.Mock).mockReturnValue({ theme: "dark", toggleTheme: toggle });
    render(<ThemeToggle />);
    const btn = screen.getByRole("button");
    fireEvent.click(btn);
    expect(toggle).toHaveBeenCalled();
  });
});
