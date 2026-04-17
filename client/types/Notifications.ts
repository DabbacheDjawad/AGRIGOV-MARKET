export interface Notification {
  id: number;
  notification_type: string;
  title: string;
  message: string;
  data: {
    order_id?: number;
    mission_id?: number;
    product_id?: number;
    user_id?: number;
    reason?: string;
    old_price?: number;
    new_price?: number;
  };
  is_read: boolean;
  created_at: string;
}

export interface NotificationApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Notification[];
}