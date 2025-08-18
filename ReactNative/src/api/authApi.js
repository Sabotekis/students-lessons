export async function getLoggedInUser() {
  const res = await fetch('http://192.168.200.124:5000/api/auth/protected', {
    credentials: 'include'
  });
  const data = await res.json();
  if (data.status === "success" && data.user) {
    return data.user;
  }
  return null;
}

export async function logoutUser() {
  await fetch('http://192.168.200.124:5000/api/auth/logout', {
    method: 'POST',
    credentials: 'include'
  });
}