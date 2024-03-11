type Clients = {
  id: string
  name: string
  created_at: string
}

type ClientsTransition = {
  id: string
  client_id: string
  name: string
  created_at: string
  transition_type: TransitionType
  amount: string
  signature: string
  archive: boolean
}

type TransitionType =
  | 'TopUp'
  | 'Tip'
  | 'Expense'
  | 'Commission'
  | 'Insurance'
  | 'CashOut'
  | null
