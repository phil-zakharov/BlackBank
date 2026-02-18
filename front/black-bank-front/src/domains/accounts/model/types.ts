export interface Account {
  id: string;
  name: string;
  balance: number;
  currency?: string;
}

export interface GetAccountsResponse {
  accounts: Account[];
}

export interface CreateAccountRequest {
  name: string;
  initialBalance?: number;
}

export interface CreateAccountResponse {
  account: Account;
}
