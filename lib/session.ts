export type CurrentUser = {
  name: string;
  email: string;
  role: string;
};

// TODO: replace with the signed-in user from the BFF once login is wired up.
export function getCurrentUser(): CurrentUser {
  return {
    name: "Jason Ampah",
    email: "admin@company.com",
    role: "SysAdmin",
  };
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
