export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
  }
  window.location.href = '/login';
}