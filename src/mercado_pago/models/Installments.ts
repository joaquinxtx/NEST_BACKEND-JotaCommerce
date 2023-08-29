export interface Installment {
    payment_method_id:   string;
    payment_type_id:     string;
    issuer:              Issuer;
    processing_mode:     string;
    merchant_account_id: null;
    payer_costs:         PayerCost[];
    agreements:          null;
}

export interface Issuer {
    id:               string;
    name:             string;
    secure_thumbnail: string;
    thumbnail:        string;
}

export interface PayerCost {
    installments:               number;
    installment_rate:           number;
    discount_rate:              number;
    reimbursement_rate:         null;
    labels:                     string[];
    installment_rate_collector: string[];
    min_allowed_amount:         number;
    max_allowed_amount:         number;
    recommended_message:        string;
    installment_amount:         number;
    total_amount:               number;
    payment_method_option_id:   string;
}