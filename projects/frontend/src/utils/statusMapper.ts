// src/utils/statusMapper.ts
export function uiFromApiStatus(apiStatus?: string): string {
  switch (apiStatus) {
    case "active":
      return "active";
    case "inactive":
      return "inactive";
    default:
      return "active"; 
  }
}

export function apiFromUiStatus(uiStatus?: string): string | undefined {
  switch (uiStatus) {
    case "active":
      return "active";
    case "inactive":
      return "inactive";
    default:
      return undefined;
  }
}
