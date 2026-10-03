import { fireEvent, render, screen } from "@testing-library/react";
import LoginForm from "@/components/ui/Auth/LoginForm";

describe("LoginForm", () => {
  it("renders the email, password and sign in fields", () => {
    render(<LoginForm />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
  });

  it("shows an error when submitted empty", () => {
    render(<LoginForm />);

    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Enter your email and password.",
    );
  });

  it("clears the error when the user types", () => {
    render(<LoginForm />);

    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "admin@company.com" },
    });

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("toggles password visibility", () => {
    render(<LoginForm />);
    const password = screen.getByLabelText("Password");

    expect(password).toHaveAttribute("type", "password");

    fireEvent.click(screen.getByRole("button", { name: "Show password" }));

    expect(password).toHaveAttribute("type", "text");
  });
});
