import "@testing-library/jest-dom";

jest.mock("next/router", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

jest.mock("@supabase/auth-helpers-react", () => ({
  useSupabaseClient: jest.fn(),
  useUser: jest.fn(),
}));

jest.mock("@supabase/auth-ui-react", () => ({
  Auth: jest.fn(),
}));

Object.defineProperty(window.Element.prototype, "scrollIntoView", {
  writable: true,
  value: jest.fn(),
});
