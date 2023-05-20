import "@testing-library/jest-dom";
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

Object.defineProperty(window.Element.prototype, "scrollIntoView", {
  writable: true,
  value: jest.fn(),
});
