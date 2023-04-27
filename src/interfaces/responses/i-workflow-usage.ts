export interface IWorkflowUsage {
  billable: {
    UBUNTU?: {
      total_ms?: number | undefined;
    };
    MACOS?: {
      total_ms?: number | undefined;
    };
    WINDOWS?: {
      total_ms?: number | undefined;
    };
  };
}
