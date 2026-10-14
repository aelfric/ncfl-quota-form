import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App.tsx";
import { http, HttpResponse } from "msw/http";
import { setupServer } from "msw/node";

const handlers = [
  http.post("https://docs.google.com/forms/d/*/formResponse", () => {
    return HttpResponse.json({
      id: "abc-123",
      firstName: "John",
      lastName: "Maverick",
    });
  }),
];

const server = setupServer(...handlers);

describe("the form", () => {
  beforeAll(() => {
    server.listen();
  });
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 13, 13));
    // @ts-expect-error https://github.com/testing-library/user-event/issues/1115
    globalThis.jest = {
      advanceTimersByTime: vi.advanceTimersByTime.bind(vi),
    };
  });
  afterEach(() => server.resetHandlers());
  afterAll(() => {
    server.close();
    vi.useRealTimers();
  });

  it("works", async () => {
    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime.bind(vi),
    });
    render(<App />);
    const diocese = screen.getByLabelText("Diocese");
    const name = screen.getByLabelText("Contact Name");
    const phone = screen.getByLabelText("Contact Phone");
    const email = screen.getByLabelText("Contact Email");
    await user.selectOptions(diocese, "New York - NY");
    await user.type(name, "John Smith");
    await user.type(phone, "555-5555");
    await user.type(email, "me@example.com");

    const option = screen.getByRole("radio", {
      name: /60 entries/,
    });
    await user.click(option);
    const submit = screen.getByRole("button", { name: "Submit" });
    await user.click(submit);

    expect(await screen.findByText(/^INV-2610/)).toBeInTheDocument();
  });
});
