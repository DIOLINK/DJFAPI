// @vitest-environment jsdom
import { render, screen, fireEvent } from "@testing-library/react";
import ThemeToggle from "../ThemeToggle";
import { useThemeStore } from "../../stores/useThemeStore";
import { describe, it, beforeEach, expect, vi } from "vitest";

vi.mock("../../stores/useThemeStore");

const mockUseThemeStore = useThemeStore as unknown as ReturnType<typeof vi.fn>;

describe("ThemeToggle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza y muestra el ícono de tema actual", () => {
    mockUseThemeStore.mockReturnValue({ theme: "light", toggleTheme: vi.fn() });
    render(<ThemeToggle />);
    expect(screen.getByRole("button", { name: /cambiar claro\/oscuro/i })).toBeInTheDocument();
    expect(screen.getByText("☀️")).toBeInTheDocument();
  });

  it("llama a toggleTheme() al hacer click", () => {
    const toggle = vi.fn();
    mockUseThemeStore.mockReturnValue({ theme: "dark", toggleTheme: toggle });
    render(<ThemeToggle />);
    const btn = screen.getByRole("button", { name: /cambiar claro\/oscuro/i });
    fireEvent.click(btn);
    expect(toggle).toHaveBeenCalled();
  });
});
