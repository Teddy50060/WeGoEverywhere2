// src/utils/statusMapper.ts
export function uiFromApiStatus(apiStatus?: string): string {
  switch (apiStatus) {
    case "active":
      return "publish";
    case "inactive":
      return "unpublish";
    default:
      return "publish"; 
  }
}

export function apiFromUiStatus(uiStatus?: string): string | undefined {
  switch (uiStatus) {
    case "publish":
      return "active";
    case "unpublish":
      return "inactive";
    default:
      return undefined;
  }
}
