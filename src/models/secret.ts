export type githubSecret = {
  name: string;
  created_at: string;
  updated_at: string;
};

export type githubSecretResponse = {
  name: string;
  created_at: string;
  updated_at: string;
};

export type githubSecretListResponse = {
  total_count: number;
  secrets: githubSecret[];
};

export type githubSecretsPublicKeyResponse = {
  status: number;
  url: string;
  headers: any;
  data: {
    key_id: string;
    key: string;
  };
};
